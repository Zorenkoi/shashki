import { createSlice } from '@reduxjs/toolkit'
import uniqid from 'uniqid'

const initialArrPawns = generateArrPawns()
const initialArrCubes = generateArrCubes()

const initialState = {
  whoIsWalking: 'black',
  isWalkingNow: false,
  /////////////////////////////
  arrCubes: initialArrCubes,
  arrMoveCubes: [],
  //////////////////////////////
  arrPawns: initialArrPawns,
  arrQuens: [],
  activePawn: null,
  //////////////////////////////
  arrPossibleActivePawn: getArrPossibleActivePawn(initialArrPawns, [], 'black'),
}

export const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    setIsWalkingNow: (state, action) => {
      return { ...state, isWalkingNow: action.payload }
    },
    changeWalker: (state, action) => {
      const newWalker = getNewWalker(state)
      return { ...state, whoIsWalking: newWalker, activePawn: null }
    },
    setWhoIsWalking: (state, action) => {
      const newWalker = action.payload
      return { ...state, whoIsWalking: newWalker, activePawn: null }
    },
    ////////////////////////////////////////////////////////////////
    setArrMoveCubes: (state, action) => {
      const { arrCubes, arrPawns } = state
      const { pawnId } = action.payload

      const pawn = getPawnById(arrPawns, pawnId)
      const arrMoveParams = getArrMoveParamsByPawn(arrPawns, pawn)
      const arrMoveParamsWithCubeId = getArrMoveParamsWithCubeId(
        arrMoveParams,
        arrCubes
      )
      const arrMoveParamsWithPawnId = arrMoveParamsWithCubeId.map(
        (moveCube) => {
          return { ...moveCube, pawnId }
        }
      )

      return { ...state, arrMoveCubes: arrMoveParamsWithPawnId }
    },
    setArrMoveCubesAfterKill: (state, action) => {
      const { arrCubes, arrPawns, whoIsWalking, arrQuens } = state
      const { pawnId } = action.payload

      const pawn = getPawnById(arrPawns, pawnId)
      const arrMoveParams = getArrMoveP_AfterKill(arrPawns, pawn)

      if (arrMoveParams.length === 0) {
        const newWalker = getNewWalker(whoIsWalking)
        const arrPossibleActivePawn = getArrPossibleActivePawn(
          arrPawns,
          arrQuens,
          newWalker
        )
        return {
          ...state,
          whoIsWalking: newWalker,
          activePawn: null,
          arrMoveCubes: [],
          isWalkingNow: false,
          arrPossibleActivePawn,
        }
      }

      const arrMoveParamsWithCubeId = getArrMoveParamsWithCubeId(
        arrMoveParams,
        arrCubes
      )
      const arrMoveParamsWithPawnId = arrMoveParamsWithCubeId.map(
        (moveCube) => {
          return { ...moveCube, pawnId }
        }
      )

      const arrPossibleActivePawn = getArrPossibleActivePawn(
        arrPawns,
        arrQuens,
        whoIsWalking
      )
      return {
        ...state,
        arrMoveCubes: arrMoveParamsWithPawnId,
        isWalkingNow: true,
        arrPossibleActivePawn,
      }
    },
    setArrMoveCubesForQuen: (state, action) => {
      const { arrCubes, arrPawns, whoIsWalking } = state
      const { pawnId } = action.payload
      const quen = getPawnById(arrPawns, pawnId)
      const arrMoveParams = getArrMoveParamsForQuen(arrPawns, quen)

      /////////////////////////////////////////////////////////////
      const arrMoveParamsWithCubeId = getArrMoveParamsWithCubeId(
        arrMoveParams,
        arrCubes
      )
      const arrMoveParamsWithPawnId = arrMoveParamsWithCubeId.map(
        (moveCube) => {
          return { ...moveCube, pawnId }
        }
      )

      console.log(arrMoveParamsWithPawnId)

      return { ...state, arrMoveCubes: arrMoveParamsWithPawnId }
    },
    cleanArrMoveCubes: (state, action) => {
      return { ...state, arrMoveCubes: [] }
    },
    ////////////////////////////////////////////////////////////////
    setActivePawn: (state, action) => {
      const { pawnId } = action.payload
      return {
        ...state,
        activePawn: pawnId,
      }
    },
    cleanActivePawn: (state, action) => {
      return {
        ...state,
        activePawn: null,
      }
    },
    movePawn: (state, action) => {
      const { arrPawns } = state
      const { pawnId, x: newX, y: newY } = action.payload

      const newArrPawns = arrPawns.map((pawn) => {
        if (pawn.pawnId === pawnId) {
          return { ...pawn, x: newX, y: newY }
        }

        return pawn
      })

      return {
        ...state,
        arrPawns: newArrPawns,
      }
    },
    removePawn: (state, action) => {
      const { arrPawns } = state
      const { pawnId } = action.payload

      const newArrPawns = arrPawns.filter((pawn) => pawn.pawnId !== pawnId)

      return {
        ...state,
        arrPawns: newArrPawns,
      }
    },
    ////////////////////////////////////////////////////////////////
    addQuen: (state, action) => {
      const { arrQuens } = state
      const { pawnId } = action.payload
      return { ...state, arrQuens: [...arrQuens, pawnId] }
    },
    setArrPossibleActivePawn: (state, action) => {
      const { arrPawns, arrQuens } = state
      const whoIsWalking = action.payload
      const arrPossibleActivePawn = getArrPossibleActivePawn(
        arrPawns,
        arrQuens,
        whoIsWalking
      )

      return { ...state, arrPossibleActivePawn }
    },
  },
})

function generateArrCubes() {
  const arrCubes = []

  for (let y = 0; y <= 7; y++) {
    for (let x = 0; x <= 7; x++) {
      const cubeColor = (x + y) % 2 === 0 ? 'black' : 'white'

      arrCubes.push({
        y,
        x,
        cubeColor,
        cubeId: uniqid(),
      })
    }
  }

  return arrCubes
}
function generateArrPawns() {
  const arrPawn = []

  for (let y = 0; y <= 7; y++) {
    for (let x = 0; x <= 7; x++) {
      const cubeColor = (x + y) % 2 === 0 ? 'black' : 'white'

      if (cubeColor === 'black') {
        if (y >= 0 && y <= 2) {
          arrPawn.push({
            y,
            x,
            pawnColor: 'white',
            pawnId: uniqid(),
          })
        } else if (y >= 5 && y <= 7) {
          arrPawn.push({
            y,
            x,
            pawnColor: 'black',
            pawnId: uniqid(),
          })
        }
      }
    }
  }

  return arrPawn
}

////////////////////////////////////////////////

function getArrMoveParamsByPawn(arrPawns, { x: startX, y: startY, pawnColor }) {
  let isKillInMoveParams = false
  let arrMoveParams = []

  const vectors = [
    { x: -1, y: +1 },
    { x: +1, y: +1 },
    { x: -1, y: -1 },
    { x: +1, y: -1 },
  ]

  for (let i = 0; i < vectors.length; i++) {
    const vector = vectors[i]
    const nowPosition = { x: startX, y: startY }
    const nextPosition = getNextPosition(nowPosition, vector)
    if (!checkPosition(nextPosition)) continue

    const diePawn = getPawnByPosition(arrPawns, nextPosition)

    if (diePawn && diePawn.pawnColor === pawnColor) {
      continue
    }

    if (diePawn && diePawn.pawnColor !== pawnColor) {
      const Next2Position = getNextPosition(nextPosition, vector)
      const die2Pawn = getPawnByPosition(arrPawns, Next2Position)
      if (!checkPosition(Next2Position)) continue
      if (die2Pawn) continue
      isKillInMoveParams = true
      arrMoveParams.push({ ...Next2Position, diePawnId: diePawn.pawnId })
      continue
    }

    if (pawnColor === 'black' && vector.y === 1) continue
    if (pawnColor === 'white' && vector.y === -1) continue

    arrMoveParams.push({ ...nextPosition })
  }

  function getNextPosition(nowPosition, vector) {
    return {
      x: nowPosition.x + vector.x,
      y: nowPosition.y + vector.y,
    }
  }
  function checkPosition(position) {
    const { x, y } = position
    if (x >= 0 && x <= 7 && y >= 0 && y <= 7) return true
    return false
  }

  if (isKillInMoveParams) {
    arrMoveParams = arrMoveParams.filter(({ diePawnId }) => diePawnId)
  }

  return arrMoveParams
}
function getArrMoveP_AfterKill(arrPawns, { x: startX, y: startY, pawnColor }) {
  const arrMoveParams = []

  const vectors = [
    { x: -1, y: +1 },
    { x: +1, y: +1 },
    { x: -1, y: -1 },
    { x: +1, y: -1 },
  ]

  for (let i = 0; i < vectors.length; i++) {
    const vector = vectors[i]
    const nowPosition = { x: startX, y: startY }
    const nextPosition = getNextPosition(nowPosition, vector)

    const diePawn = getPawnByPosition(arrPawns, nextPosition)

    if (diePawn && diePawn.pawnColor === pawnColor) {
      continue
    }

    if (diePawn && diePawn.pawnColor !== pawnColor) {
      const Next2Position = getNextPosition(nextPosition, vector)
      const die2Pawn = getPawnByPosition(arrPawns, Next2Position)
      if (!checkPosition(Next2Position)) continue
      if (die2Pawn) continue
      arrMoveParams.push({ ...Next2Position, diePawnId: diePawn.pawnId })
      continue
    }
  }

  function getNextPosition(nowPosition, vector) {
    return {
      x: nowPosition.x + vector.x,
      y: nowPosition.y + vector.y,
    }
  }
  function checkPosition(position) {
    const { x, y } = position
    if (x >= 0 && x <= 7 && y >= 0 && y <= 7) return true
    return false
  }

  return arrMoveParams
}
function getArrMoveParamsForQuen(
  arrPawns,
  { x: startX, y: startY, pawnColor }
) {
  let isKillInMoveParams = false
  let arrMoveParams = []

  const vectors = [
    { x: -1, y: +1 },
    { x: +1, y: +1 },
    { x: -1, y: -1 },
    { x: +1, y: -1 },
  ]

  const nowPosition = { x: startX, y: startY }
  vectors.forEach((vector) => vectorRecursion(vector, nowPosition))

  function vectorRecursion(vector, position, prevDiePawnId) {
    const nextPosition = getNextPosition(position, vector)
    if (!checkPosition(nextPosition)) return

    const diePawn = getPawnByPosition(arrPawns, nextPosition)

    if (diePawn && diePawn.pawnColor === pawnColor) {
      return
    }

    if (diePawn && diePawn.pawnColor !== pawnColor) {
      const Next2Position = getNextPosition(nextPosition, vector)
      const die2Pawn = getPawnByPosition(arrPawns, Next2Position)
      if (!checkPosition(Next2Position)) return
      if (die2Pawn) return
      isKillInMoveParams = true
      arrMoveParams.push({ ...Next2Position, diePawnId: diePawn.pawnId })
      vectorRecursion(vector, nextPosition, diePawn.pawnId)
      return
    }

    if (prevDiePawnId) {
      arrMoveParams.push({ ...nextPosition, diePawnId: prevDiePawnId })
    } else {
      arrMoveParams.push({ ...nextPosition })
    }

    vectorRecursion(vector, nextPosition, prevDiePawnId)
  }
  function getNextPosition(nowPosition, vector) {
    return {
      x: nowPosition.x + vector.x,
      y: nowPosition.y + vector.y,
    }
  }
  function checkPosition(position) {
    const { x, y } = position
    if (x >= 0 && x <= 7 && y >= 0 && y <= 7) return true
    return false
  }

  if (isKillInMoveParams) {
    arrMoveParams = arrMoveParams.filter(({ diePawnId }) => diePawnId)
  }

  return arrMoveParams
}
function getArrMoveParamsWithCubeId(arrMoveParams, arrCubes) {
  const res = []

  for (let i = 0; i < arrMoveParams.length; i++) {
    const moveParam = arrMoveParams[i]

    for (let j = 0; j < arrCubes.length; j++) {
      const cube = arrCubes[j]

      if (isPositionEquel(cube, moveParam)) {
        res.push({ ...moveParam, cubeId: cube.cubeId })
        break
      }
    }
  }

  return res
}

function isPositionEquel(position1, position2) {
  if (position1.x === position2.x && position1.y === position2.y) return true

  return false
}

function getPawnByPosition(arrPawns, position) {
  return arrPawns.find((pawn) => isPositionEquel(pawn, position))
}
function getPawnById(arrPawns, pawnId) {
  return arrPawns.find((pawn) => pawn.pawnId === pawnId)
}

function getArrPossibleActivePawn(arrPawns, arrQuins, whoIsWalking) {
  let res = []
  let isKillHere = false

  let filteredArrPawns = arrPawns.filter(
    ({ pawnColor }) => whoIsWalking === pawnColor
  )

  filteredArrPawns.forEach((pawn) => {
    let moveParams
    if (checkIsQuen(arrQuins, pawn.pawnId)) {
      moveParams = getArrMoveParamsForQuen(arrPawns, pawn)
    } else {
      moveParams = getArrMoveParamsByPawn(arrPawns, pawn)
    }

    if (moveParams.length > 0) {
      moveParams.forEach((moveParam) => {
        res.push({ ...moveParam, pawnId: pawn.pawnId })

        if (!!moveParam.diePawnId) {
          isKillHere = true
        }
      })
    }
  })

  if (isKillHere) {
    res = res.filter(({ diePawnId }) => !!diePawnId)
  }

  return res
}

function getNewWalker(whoIsWalking) {
  const obj = {
    black: 'white',
    white: 'black',
  }
  return obj[whoIsWalking]
}
function checkIsQuen(arrQuins, pawnId) {
  return !!arrQuins.find((quinId) => pawnId === quinId)
}

////////////////////////////////////////////////

const mainReducer = mainSlice.reducer
export const {
  changeWalker,
  setWhoIsWalking,
  setActivePawn,
  setIsWalkingNow,
  setArrMoveCubes,
  cleanArrMoveCubes,
  setArrMoveCubesAfterKill,
  setArrPossibleActivePawn,
  setArrMoveCubesForQuen,
  cleanActivePawn,
  addQuen,
  movePawn,
  removePawn,
} = mainSlice.actions
export default mainReducer
