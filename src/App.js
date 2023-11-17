import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  setWhoIsWalking,
  setArrMoveCubes,
  setArrMoveCubesAfterKill,
  setArrPossibleActivePawn,
  setArrMoveCubesForQuen,
  cleanArrMoveCubes,
  setActivePawn,
  cleanActivePawn,
  addQuen,
  movePawn,
  removePawn,
} from './redux/reducers/mainReducer'
import './App.css'

function App() {
  const { arrPawns, arrCubes } = useSelector((state) => state.mainReducer)

  return (
    <div className='App'>
      <div className='cubes-container'>
        {arrCubes.map((cubeObj) => {
          return <Cube key={cubeObj.cubeId} {...cubeObj} />
        })}
        {arrPawns.map((pawnObj) => {
          return <Pawn key={pawnObj.pawnId} {...pawnObj} />
        })}
      </div>
    </div>
  )
}

const Cube = ({ y, x, cubeColor, cubeId }) => {
  const dispatch = useDispatch()
  const { arrMoveCubes, whoIsWalking } = useSelector(
    (state) => state.mainReducer
  )

  const [moveParam, setMoveCubeParams] = useState(null)

  useEffect(() => {
    const moveParam = arrMoveCubes.find(
      (moveCube) => moveCube.cubeId === cubeId
    )
    setMoveCubeParams(moveParam)
  }, [arrMoveCubes, cubeId])

  const clickCube = () => {
    if (!moveParam) return

    if (moveParam.diePawnId) {
      dispatch(removePawn({ pawnId: moveParam.diePawnId }))
      dispatch(movePawn({ x, y, pawnId: moveParam.pawnId }))
      dispatch(setArrMoveCubesAfterKill({ pawnId: moveParam.pawnId }))
      return
    }
    if (moveParam.pawnId) {
      const newWalker = getNewWalker(whoIsWalking)

      dispatch(movePawn({ x, y, pawnId: moveParam.pawnId }))
      dispatch(cleanArrMoveCubes())
      dispatch(cleanActivePawn())
      dispatch(setWhoIsWalking(newWalker))
      dispatch(setArrPossibleActivePawn(newWalker))
    }
  }

  const getClassName = () => {
    if (moveParam) {
      return `cube move ${cubeColor}`
    }
    return `cube ${cubeColor}`
  }
  return <div onClick={clickCube} className={getClassName()}></div>
}
const Pawn = ({ y, x, pawnColor, pawnId }) => {
  const dispatch = useDispatch()
  const { activePawn, whoIsWalking, isWalkingNow, arrPossibleActivePawn } =
    useSelector((state) => state.mainReducer)

  const isPossibleActive = checkIsPossibleActive(arrPossibleActivePawn, pawnId)

  const [isActive, setIsActive] = useState(false)
  const [isQuen, setIsQuen] = useState(false)

  useEffect(() => {
    setIsActive(activePawn === pawnId)
    if (checkIsQuen(pawnColor, y, x)) {
      setIsQuen(true)
      dispatch(addQuen({ pawnId }))
    }
  }, [pawnId, activePawn])

  const clickPawn = () => {
    if (isWalkingNow) return
    if (whoIsWalking !== pawnColor) return
    if (!isPossibleActive) return

    if (isActive) {
      dispatch(cleanActivePawn())
      dispatch(cleanArrMoveCubes())
      return
    }

    if (isQuen) {
      dispatch(setActivePawn({ pawnId }))
      dispatch(setArrMoveCubesForQuen({ pawnId }))
      return
    }

    dispatch(setActivePawn({ pawnId }))
    dispatch(setArrMoveCubes({ pawnId }))
  }

  const getClassName = () => {
    let classname = `pawn ${pawnColor} `

    if (isPossibleActive && whoIsWalking === pawnColor) {
      classname += 'possible '
    }

    if (isActive) {
      classname += 'active '
    }

    if (isQuen) {
      classname += 'quen'
    }

    return classname
  }
  const pawnStyle = {
    top: y * 60 + 'px',
    left: x * 60 + 'px',
  }
  return (
    <div onClick={clickPawn} style={pawnStyle} className={getClassName()}></div>
  )
}

function getNewWalker(whoIsWalking) {
  const obj = {
    black: 'white',
    white: 'black',
  }
  return obj[whoIsWalking]
}

function checkIsPossibleActive(arrPossibleActive, pawnId) {
  return !!arrPossibleActive.find(
    (possibleActiveid) => possibleActiveid.pawnId === pawnId
  )
}

function checkIsQuen(pawnColor, y, x) {
  // if (x === 3) return true
  if (pawnColor === 'black' && y === 0) return true
  if (pawnColor === 'white' && y === 7) return true
  return false
}

export default App
