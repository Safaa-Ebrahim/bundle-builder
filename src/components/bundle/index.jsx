import { useCatalog } from '../../hooks/useCatalog'
import BundleContent from './BundleContent'
import BundleSkeleton from './BundleSkeleton'

const Bundle = () => {
  const { status, data } = useCatalog()

  if (status === 'loading') return <BundleSkeleton />

  return <BundleContent data={data} />
}

export default Bundle
