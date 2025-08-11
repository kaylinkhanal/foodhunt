import jwt from 'jsonwebtoken';
const validateToken =async (req, res, next) =>{
    if(req.headers.authorization){
        const token = req.headers.authorization.split(" ")[1];
        console.log("Token received:", token);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized access" });
        }
        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; 
            next(); 
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    }
}

export default validateToken;