import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Withdrawal from '../services/Withdrawal'
import { updateWithdrawn } from './finance'
import { triggerToast } from './toast'
import { PopupType } from 'react-custom-popup'

const withdrawal = createSlice({
  name: 'withdrawal',
  initialState: { loading: false, withdrawals: { count: 0, data: [] } },
  reducers: {
    addWithdrawals(state, action) {
      state.withdrawals = action.payload
    },
    addMsg(state, action) {
      state.msg = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getWithdrawalsHandler.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(getWithdrawalsHandler.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getWithdrawalsHandler.rejected, (state) => {
      state.loading = false
    })
  },
})

export const getWithdrawalsHandler = createAsyncThunk(
  'withdrawal/getWithdrawals',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { data, message, status } = await Withdrawal.getWithdrawals(payload)
      if (status === 200) {
        dispatch(addWithdrawals(data))
      } else {
        dispatch(triggerToast({ message, type: PopupType.DANGER }))
        return rejectWithValue(message)
      }
    } catch (error) {
      dispatch(triggerToast({ message: error.message, type: PopupType.DANGER }))
      return rejectWithValue(message)
    }
  },
)

export const addWithdrawalHandler = (payload) => async (dispatch) => {
  try {
    let { status, message } = await Withdrawal.addWithdrawal(payload)
    if (status === 200) {
      dispatch(triggerToast({ message, type: PopupType.INFO }))
    } else {
      dispatch(addMsg(message))
    }
  } catch (error) {
    dispatch(addMsg(error))
  }
}

export default withdrawal.reducer
export const { addWithdrawals, addMsg } = withdrawal.actions
