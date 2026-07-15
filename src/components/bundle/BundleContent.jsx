import { useBundle } from '../../hooks/useBundle'
import Builder from './builder'
import ReviewPanel from './review'

export default function BundleContent({ data }) {
  const bundle = useBundle(data)

  return (
    <div className="min-h-svh py-8 px-4 xl:px-10">
      <p className='block lg:hidden font-bold text-3xl text-text-secondary text-center mb-3'>Let's get started!</p>
      <div className="auto grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-1 gap-6 items-start ">
        <Builder data={data} bundle={bundle} />
        <ReviewPanel data={data} bundle={bundle} />
      </div>
    </div>
  )
}
