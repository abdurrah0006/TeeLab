import { AnimatePresence, motion } from 'framer-motion'
import { useSnapshot } from 'valtio'
import state from './store'
import Landing from './pages/Landing'
import Editor from './pages/Editor'

const fade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export default function App() {
  const { page } = useSnapshot(state)
  return (
    <AnimatePresence mode="wait">
      <motion.div key={page} className="h-full" {...fade}>
        {page === 'landing' ? <Landing /> : <Editor />}
      </motion.div>
    </AnimatePresence>
  )
}
