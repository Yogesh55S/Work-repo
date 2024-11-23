import React from 'react'
import Banner from '../Component/Home/Banner'
import AboutUs from '../Component/Home/AboutUs'
import Winter from '../Component/Home/Winter'
import Care from '../Component/Home/Care'
import OurProducts from '../Component/Home/OurProducts'
import Testimonial from '../Component/Home/Testimonial'

const Home = () => {
  return (
    <div>
        <Banner />
        <AboutUs/>
        <Winter/>
        <Care/>
        <OurProducts/>
        <Testimonial/>
    </div>
  )
}

export default Home