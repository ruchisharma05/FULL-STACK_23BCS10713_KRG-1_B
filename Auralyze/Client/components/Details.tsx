"use client"
import { currentEvent, featuresSec, testimonial } from '@/app/data'
import React, { useState } from 'react'

const Details = () => {
    const [hover, sethover] = useState<number | null>(null);
  return (
    <div className='flex w-full flex-wrap justify-center mt-5 gap-8'>
        <div>
            <p className='tracking-base text-xl font-semibold text-eblack border-b-[1px] pb-3 border-b-gray-200'>Testimonial</p>
            <div className='rounded-xl w-80 h-[375px] border-[1px] mt-8 flex justify-center items-center flex-col gap-4'>
                <img height={80} width={80} src={testimonial.imgLink} className=' rounded-full'/>
                <p className=' text-silver font-bold text-lg tracking-wide'>{testimonial.name} </p>
                <p className=' text-onyx'>{testimonial.position} </p>
                <img width={30} src='https://codewithsadee.github.io/anon-ecommerce-website/assets/images/icons/quotes.svg'/>
                <p className='w-[175px] text-center text-silver'>{testimonial.description} </p>
            </div>
        </div>


    </div>
  )
}

export default Details