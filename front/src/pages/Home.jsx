import React from 'react'
import Hero from '../components/Hero'
import RecommendationSection from '../components/RecommendationSection'
import PremiereSection from '../components/PremiereSection'
import NewsletterBox from '../components/NewsletterBox'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
      <Hero/>
      <RecommendationSection/>
      <PremiereSection/>
      <NewsletterBox/>
    </div>
  )
}

export default Home
