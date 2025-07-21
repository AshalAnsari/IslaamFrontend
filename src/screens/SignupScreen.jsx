import React from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const SignupScreen = () => {

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  })

  return (
    <div 
      className="w-full h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url(../src/assets/bg.jpg)" }}
    >
      <div className="absolute left-[20%] top-[30%] w-[300px]">
        <h1 className='text-4xl font-bold text-white'>Create your account</h1>
      </div>

      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log('Form Values:', values)
        }}
      >
        {({ touched, errors }) => (
          <Form className="absolute w-[30%] bottom-[10%] right-[10%] m-8 flex flex-col gap-5 bg-white bg-opacity-80 p-6 rounded shadow-md py-[5%]">
            <div>
              <Field
                type="text"
                name="name"
                placeholder="Enter name"
                className="p-2 border border-gray-300 rounded py-[2%] w-full"
              />
              <ErrorMessage name="name" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <Field
                type="email"
                name="email"
                placeholder="Enter email"
                className="p-2 border border-gray-300 rounded py-[2%] w-full"
              />
              <ErrorMessage name="email" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <Field
                type="password"
                name="password"
                placeholder="Enter password"
                className="p-2 border border-gray-300 rounded py-[2%] w-full"
              />
              <ErrorMessage name="password" component="div" className="text-red-600 text-sm" />
            </div>

            <div>
              <Field
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                className="p-2 border border-gray-300 rounded py-[2%] w-full"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
            </div>

            <div className='flex flex-row justify-between items-center'>
              <h2 className='text-xl font-bold text-black'>
                Already have an account? <Link to={"/"} className='text-blue-600'>Login</Link>
              </h2>
                <Link
                    className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
                    to={"/dashboard"}
                >
                    Sign Up
                </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignupScreen
