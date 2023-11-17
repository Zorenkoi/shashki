import { createSlice } from '@reduxjs/toolkit'
import uniqid from 'uniqid'

const initialState = {
  arrCubes: generateArrCubes(),
  arrMoveCubes: [],
}
export const cubeSlice = createSlice({
  name: 'cube',
  initialState,
  reducers: {
    setArrMoveCubes: (state, action) => {
      return { ...state, arrMoveCubes: action.payload.arrMoveCubes }
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

const cubeReducer = cubeSlice.reducer
export const {} = cubeSlice.actions
export default cubeReducer
