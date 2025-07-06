'use client'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


import { User,MapPin } from 'lucide-react'; // Keep icons you might reuse, remove others
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns"; 

import Link from 'next/link'; 
import axios from 'axios';

import { useRouter } from 'next/navigation';
import {  useSelector } from 'react-redux';
import { useEffect, useState } from 'react';



const validationSchema = Yup.object({
  location: Yup.string().required('Location is required'),
  panId: Yup.string()
    .matches(/^[0-9]{9}$/, 'PAN ID must be 9 digits') 
    .required('PAN ID is required'),
  registrationDate: Yup.string() 
    .required('Registration Date is required'),
});

const SellerKycForm = () => {
    const {_id} = useSelector((state) => state.user);
    const [coords, setCoords] = useState({})
  const initialValues = {
    location: '',
    panId: '',
    registrationDate: '', // Will store formatted date string
  };
  const router = useRouter();
  useEffect(()=>{
    if(navigator?.geolocation){
      navigator.geolocation.getCurrentPosition((item)=>{
        setCoords({lat: item.coords.latitude, lng: item.coords.longitude})
      })
    }

  },[])

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    const {data} = await axios.post(process.env.NEXT_PUBLIC_API_URL+ '/kycs/' +_id, {...values,coords})
    alert(data.message)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Seller KYC Submission</h2>
          <CardDescription>Please provide your business and registration details.</CardDescription>
        </div>


        {/* KYC Form */}
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardContent>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-4">
                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>Business Location</span>
                    </Label>
                    <Field
                      as={Input}
                      id="location"
                      name="location"
                      type="text"
                      placeholder="e.g., Kathmandu, Nepal"
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                    <ErrorMessage name="location" component="div" className="text-destructive text-sm" />
                  </div>

                  {/* PAN ID */}
                  <div className="space-y-2">
                    <Label htmlFor="panId" className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-primary" /> {/* Using User icon for PAN for example */}
                      <span>PAN ID</span>
                    </Label>
                    <Field
                      as={Input}
                      id="panId"
                      name="panId"
                      type="text"
                      placeholder="e.g., 123456789"
                      className="transition-all focus:ring-2 focus:ring-primary"
                    />
                    <ErrorMessage name="panId" component="div" className="text-destructive text-sm" />
                  </div>

                  {/* Registration Date */}
                  <div className="space-y-2">
                    <Label htmlFor="registrationDate" className="flex items-center space-x-2">
                      <CalendarIcon className="h-4 w-4 text-primary" />
                      <span>Registration Date</span>
                    </Label>
                    {/* Using Shadcn UI Calendar and Popover for date selection */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={`w-full justify-start text-left font-normal ${!values.registrationDate && "text-muted-foreground"
                            }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {values.registrationDate ? (
                            format(new Date(values.registrationDate), "PPP") // Format date for display
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={values.registrationDate ? new Date(values.registrationDate) : undefined}
                          onSelect={(date) => {
                            setFieldValue('registrationDate', date ? date.toISOString().split('T')[0] : ''); // Store as 'YYYY-MM-DD' string
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <ErrorMessage name="registrationDate" component="div" className="text-destructive text-sm" />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#F9A51D] hover:bg-orange-700 text-primary-foreground font-semibold py-3 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {isSubmitting ? 'Submitting KYC...' : 'Submit KYC Details'}
                  </Button>
                </Form>
              )}
            </Formik>

            {/* Optional: Link back or other instructions */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Need help?{' '}
                <Link href="/contact" className="text-primary hover:text-primary/80 font-medium transition-colors">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerKycForm;