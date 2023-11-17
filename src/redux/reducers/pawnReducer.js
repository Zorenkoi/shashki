import { createSlice } from '@reduxjs/toolkit'
import uniqid from 'uniqid'

const initialState = {
  arrPawns: generateArrPawns(),
  activePawn: null,
}
export const pawnSlice = createSlice({
  name: 'pawn',
  initialState,
  reducers: {
    setActivePawn: (state, action) => {
      console.log(action.payload.pawnId)
      return {
        ...state,
        activePawn: action.payload.pawnId,
      }
    },
  },
})

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

const pawnReducer = pawnSlice.reducer
export const { setActivePawn } = pawnSlice.actions
export default pawnReducer
