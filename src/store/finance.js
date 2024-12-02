import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Finance from '../services/Finance'
import { triggerToast } from './toast'
import { PopupType } from 'react-custom-popup'

const initialState = {
  loading: false,
  transactions: { data: [], count: 0 },
  message: '',
  pending: 0,
  refunded: 0,
  released: 0,
  transferred: 0,
  withdrawn: 0,
  canceledWithdrawn: 0,
}

const finance = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    addData(state, action) {
      return { ...state, ...action.payload }
    },
    updateWithdrawn(state, action) {
      return { ...state, withdrawn: state.withdrawn + action.payload }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPendingAmounts.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(getPendingAmounts.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(getPendingAmounts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getTransactions.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(getTransactions.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(getTransactions.pending, (state) => {
      state.loading = true
    })
  },
})

export const getTransactions = createAsyncThunk(
  'finance/getTransactions',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { status, data, message, count } = await Finance.getTransactions(payload)
      if (status === 200) {
        dispatch(addData({ transactions: { data, count } }))
      } else {
        rejectWithValue(message)
        dispatch(errorMessage(message))
      }
    } catch (error) {
      rejectWithValue(error.message)
      dispatch(triggerToast({ type: PopupType.DANGER, message: error.message }))
    }
  },
)

export const getPendingAmounts = createAsyncThunk(
  'finance/getAmounts',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { status, data } = await Finance.getAmountsSummary()
      const getAmount = (type, status) => {
        return data.reduce((acc, current) => {
          if (current.type === type && current.status === status) {
            return acc + current.sum
          } else return acc
        }, 0)
      }
      if (status === 200) {
        const pending =
          getAmount('credit', 'pending') -
          getAmount('credit', 'released') -
          getAmount('credit', 'canceled')
        const released = getAmount('credit', 'released') - getAmount('debit', 'released')
        const refunded = getAmount('debit', 'refunded')
        dispatch(
          addData({
            pending: pending?.toFixed(2),
            released: released?.toFixed(2),
            refunded: refunded?.toFixed(2),
          }),
        )
      }
    } catch (error) {
      dispatch(triggerToast({ type: PopupType.DANGER, message: error.message }))
      return rejectWithValue(error.message)
    }
  },
)

export const { addData, updateWithdrawn } = finance.actions

export default finance.reducer
