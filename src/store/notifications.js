import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import Notifications from 'src/services/Notificaions'
import { triggerToast } from './toast'
import { PopupType } from 'react-custom-popup'

const initialState = { data: [], count: 0, isLoading: false }

const notifications = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetNotifications() {
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.data = state.data.concat(action.payload.data)
      state.count = action.payload.count
      state.isLoading = false
    })
    builder.addCase(getNotifications.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getNotifications.rejected, (state) => {
      state.isLoading = false
    })
    builder.addCase(updateNotifications.fulfilled, (state, action) => {
      state.count = 0
      state.isLoading = false
    })
    builder.addCase(updateNotifications.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(updateNotifications.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { data, status, message } = await Notifications.getNotifications(payload)
      if (status === 200) {
        return data
      } else {
        dispatch(triggerToast({ message, type: PopupType.DANGER }))
        return rejectWithValue(message)
      }
    } catch (error) {
      dispatch(triggerToast({ message: error.message, type: PopupType.DANGER }))
      return rejectWithValue(error.message)
    }
  },
)

export const updateNotifications = createAsyncThunk(
  'notifications/updateNotifications',
  async (_, { getState, rejectWithValue, dispatch }) => {
    try {
      const notifications = getState().notifications.data
      const { status, message } = await Notifications.updateNotifications(
        notifications.map((notification) => notification.id),
      )
      if (status === 200) {
        return
      } else {
        dispatch(triggerToast({ message, type: PopupType.DANGER }))
        return rejectWithValue(message)
      }
    } catch (error) {
      dispatch(triggerToast({ message: error.message, type: PopupType.DANGER }))
      return rejectWithValue(error.message)
    }
  },
)
export const { resetNotifications } = notifications.actions
export default notifications.reducer
