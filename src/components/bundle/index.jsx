import React from 'react'
import data from '../../data/products.json'
import { useBundle } from '../../hooks/useBundle'
import Builder from './builder'
import ReviewPanel from './review'

const Bundle = () => {
    const bundle = useBundle(data)

    return (
        <div className="min-h-svh py-8 px-4 xl:px-10">
            <div className="auto grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-1 gap-6 items-start ">
                <Builder data={data} bundle={bundle} />
                <ReviewPanel data={data} bundle={bundle} />
            </div>
        </div>
    )
}

export default Bundle