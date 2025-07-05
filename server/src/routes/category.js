import { Router } from "express";
import Category from "../models/category.js";
import fs from "fs";
import path from "path";
import multer from "multer";

const categoryrouter = Router();

// Multer for Category's image
const UPLOADS_DIR = "category-uploads";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const fileExtension = path.extname(file.originalname);
    // Fallback to image originalname incase patch request has no name in body
    const newFileNameBase = req.body.name
      ? req.body.name.replace(/[^a-zA-Z0-9_.-]/g, "")
      : path.parse(file.originalname).name.replace(/[^a-zA-Z0-9_.-]/g, "");
    cb(null, newFileNameBase + fileExtension);
  },
});

const upload = multer({ storage: storage });

categoryrouter.post("/categories", upload.single("image"), async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.filename : null;
    const category = new Category({
      name,
      description,
      image,
    });
    await category.save();
    res.status(201).json({ message: "category created", category });
  } catch (error) {
    const errorMessage = error.message;
    // Incase error stems from DB and image is uploaded on the server
    if (req.file) {
      const filePath = path.join(UPLOADS_DIR, req.file.filename);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting uploaded file:", err);
      });
    }
    res.status(500).json({ message: `Server error: ${errorMessage}` });
  }
});

categoryrouter.get("/categories", async (req, res) => {
  try {
    const data = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

categoryrouter.delete("/categories/:id", async (req, res) => {
  try {
    const categoryToDelete = await Category.findById(req.params.id);

    if (!categoryToDelete) {
      return res.status(404).json({ message: "Category not found" });
    }

    const imageFilename = categoryToDelete.image;

    const result = await Category.findByIdAndDelete(req.params.id);

    if (result && imageFilename) {
      const filePath = path.join(UPLOADS_DIR, imageFilename);

      // Check if the file exists before attempting to delete
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          console.warn(
            `File does not exist at path: ${filePath}. Skipping deletion.`
          );
          res
            .status(200)
            .json({ message: "Category deleted (file not found on server)." });
        } else {
          // Delete the file
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error(
                `Error deleting image file ${imageFilename}:`,
                unlinkErr
              );
              res.status(500).json({
                message:
                  "Category deleted, but failed to delete associated image file.",
              });
            } else {
              console.log(`Successfully deleted image file: ${imageFilename}`);
              res.status(200).json({
                message: "Category and associated file deleted successfully!",
              });
            }
          });
        }
      });
    } else {
      res.status(200).json({
        message:
          "Category deleted (no associated file or file already missing).",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

categoryrouter.patch(
  "/categories/:id",
  upload.single("image"),
  async (req, res) => {
    /* 
      For simplicity,
      It is mandatory to send name field in patch request, as multer expects name in request.
      ( The already uploaded image by multer will be deleted.) 
    */

    try {
      if (!req.body.name) {
        if (req.file) {
          // Deleting already uploaded image
          const filePath = path.join(UPLOADS_DIR, req.file.filename);
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting uploaded file:", err);
          });
        }
        return res
          .status(400)
          .json({ message: "Category name is required for update." });
      }

      const categoryToUpdate = await Category.findById(req.params.id);

      // Category with the id doesn't exist
      if (!categoryToUpdate) {
        // If an image was uploaded but the category wasn't found
        if (req.file) {
          const filePath = path.join(UPLOADS_DIR, req.file.filename);
          fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting uploaded file:", err);
          });
        }
        return res.status(404).json({ message: "Category not found" });
      }

      const previousName = categoryToUpdate.name;
      const oldImageFilename = categoryToUpdate.image
        ? categoryToUpdate.image
        : null;

      const NewImageFilename = req.file ? req.file.filename : oldImageFilename;
      const patchItems = req.body;

      // Saving every field in req.body
      for (let key in patchItems) {
        categoryToUpdate[key] = patchItems[key];
      }

      // Saving the image handled by multer middleware
      categoryToUpdate.image = NewImageFilename;

      // Incase cateory update has new name, we need to delete image with previous name
      if (previousName !== req.body.name && req.file && oldImageFilename) {
        const filePath = path.join(UPLOADS_DIR, oldImageFilename);
        fs.access(filePath, fs.constants.F_OK, async (err) => {
          if (err) {
            console.warn(
              `File does not exist at path: ${filePath}. Skipping deletion.`
            );
            await categoryToUpdate.save();
            res.status(200).json({
              message:
                "Category updated (previous image file not found on server).",
              categoryToUpdate,
            });
          } else {
            // Delete the file
            fs.unlink(filePath, async (unlinkErr) => {
              if (unlinkErr) {
                console.error(
                  `Error deleting image file ${oldImageFilename}:`,
                  unlinkErr
                );
                res.status(500).json({
                  message:
                    "Category updated (previous image file not deleted on server).",
                });
              } else {
                console.log(
                  `Successfully deleted image file: ${oldImageFilename}`
                );
                await categoryToUpdate.save();
                res.status(201).json({
                  message: "Category updated, previous image deleted",
                  categoryToUpdate,
                });
              }
            });
          }
        });
      } else if (
        previousName !== req.body.name &&
        !req.file &&
        oldImageFilename
      ) {
        // If name is changed but image is same, then we rename previous image
        const oldFilePath = path.join(UPLOADS_DIR, oldImageFilename);
        const oldFileExtension = path.extname(oldImageFilename);
        const newBaseName = req.body.name.replace(/[^a-zA-Z0-9_.-]/g, "");
        const newFilePath = path.join(
          UPLOADS_DIR,
          newBaseName + oldFileExtension
        );
        try {
          fs.access(oldFilePath, fs.constants.F_OK, (accessErr) => {
            if (accessErr) {
              return res.status(500).json({
                message: "File not found.",
                error: accessErr.message,
              });
            }

            fs.rename(oldFilePath, newFilePath, async (renameErr) => {
              if (renameErr) {
                return res.status(500).json({
                  message:
                    "Category updated (previous image file not renamed on server).",
                  error: renameErr.message,
                });
              }
              categoryToUpdate.image = newBaseName + oldFileExtension;
              await categoryToUpdate.save();
              console.log(
                `Successfully renamed image file: ${oldImageFilename} to ${
                  newBaseName + oldFileExtension
                }`
              );
              res.status(201).json({
                message: "Category updated, previous image renamed",
                categoryToUpdate,
              });
            });
          });
        } catch (error) {
          res.status(500).json({
            message: "Previous image file not deleted on server).",
            error,
          });
        }
      } else {
        await categoryToUpdate.save();
        res.status(201).json({ message: "category updated", categoryToUpdate });
      }
    } catch (error) {
      res.status(500).json({ message: "Server error", error });
    }
  }
);

export default categoryrouter;
