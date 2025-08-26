import React from 'react';

const NewsletterBox = () => {

    const onSubmitHandler =(event) => {
        event.preventDefault();
    }

    return (
        <div className='my-10 flex flex-col items-center text-center'>
            <p className='mt-3 text-text text-2xl max-w-156'>Підпишіться, щоб першими дізнаватися про новинки та оновлення!</p>
            <form className='w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border border-borderColor rounded-xl pl-3'>
                <input className='w-full sm:flex-1 outline-none' type='email' placeholder='Введіть пошту' required/>
                <button type='submit' className='bg-primary hover:bg-primary-dull text-light px-10 py-4 rounded-r-xl'>Підписатись</button>
            </form>
        </div>
    );
};

export default NewsletterBox;