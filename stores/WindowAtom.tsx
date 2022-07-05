import { atom } from 'jotai'
import { useUpdateAtom } from 'jotai/utils'

const windowAtom = atom<Window|null>(null)

window.addEventListener('load', function(){
  const setWindow = useUpdateAtom(windowAtom)
  setWindow(window)
})

export { windowAtom }
