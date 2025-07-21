import React from 'react'
import { Link } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const LoginScreen = () => {
  return (
    <div 
      className="w-full h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url(../src/assets/bg.jpg)" }}
    >
      <div className="absolute left-[20%] top-[30%] w-[250px]">
        <h1 className='text-4xl font-bold text-white'>Login into your account</h1>
      </div>

      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={LoginSchema}
        onSubmit={(values) => {
          console.log('Values: ', values)
        }}
      >
        {({ touched, errors }) => (
          <Form className="absolute w-[30%] bottom-[10%] right-[10%] m-8 flex flex-col gap-5 bg-white bg-opacity-80 p-6 rounded shadow-md py-[5%]">
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

            <div className='flex flex-row justify-between'>
              <h2 className='text-xl text-black font-bold'>
                Don't have an account?{' '}
                <Link to="/signup" className='text-blue-600'>
                  Sign Up
                </Link>
              </h2>
                <Link 
                  className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 px-[8%] py[1%] rounded-half"
                  to={"/dashboard"}
                >
                  Login
                </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

const LoginSchema = Yup.object().shape({
  email:Yup.string().required('Email is Required'),
  password:Yup.string().min(7, 'Too Short').max(20, 'Too Long').required('Password is Required')
})

export default LoginScreen
