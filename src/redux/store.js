import { configureStore } from '@reduxjs/toolkit'
import mainReducer from './reducers/mainReducer'
// import { localStorageMiddleware } from '../helper/LocalStorageMiddleware'

// const persistedState = JSON.parse(localStorage.getItem('reduxState')) || {}

export const store = configureStore({
  reducer: { mainReducer },
  //   preloadedState: persistedState,
  //   middleware: [localStorageMiddleware],
})
