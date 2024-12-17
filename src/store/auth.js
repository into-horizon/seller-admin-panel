import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import cookie from 'react-cookies'
import Auth from '../services/Auth'
import Update from 'src/services/Update'
import { showDialog } from './dialog'
import { PopupType } from 'react-custom-popup'
import { triggerToast } from './toast'
const NewAuth = new Auth()
const NewUpdate = new Update()

const initialState = {
  loggedIn: false,
  user: {},
  message: '',
  loading: false,
  isLogoutLoading: false,
  isUserLoading: false,
  globalLoader: true,
  isServerDown: false,
}

const login = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginAction(state, action) {
      return { ...state, ...action.payload }
    },

    deleteMessage(state) {
      return { ...state, message: '' }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginHandler.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(loginHandler.pending, (state) => {
      state.loading = true
    })
    builder.addCase(loginHandler.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(getUser.fulfilled, (state) => {
      state.isUserLoading = false
    })
    builder.addCase(getUser.pending, (state) => {
      state.isUserLoading = true
    })
    builder.addCase(getUser.rejected, (state) => {
      state.isUserLoading = false
    })
    builder.addCase(updateInfo.fulfilled, (state, action) => {
      state.loading = false
      state.user = { ...state.user, ...action.payload }
    })
    builder.addCase(updateInfo.pending, (state) => {
      state.loading = true
    })
    builder.addCase(updateInfo.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(updateName.fulfilled, (state, action) => {
      state.loading = false
      state.user.store_name = action.payload.store_name
    })
    builder.addCase(updateName.pending, (state) => {
      state.loading = true
    })
    builder.addCase(updateName.rejected, (state) => {
      state.loading = false
    })
    builder.addCase(logout.fulfilled, (state) => {
      state.globalLoader = false
    })
    builder.addCase(logout.pending, (state) => {
      state.globalLoader = true
    })
    builder.addCase(logout.rejected, (state) => {
      state.globalLoader = false
    })
    builder.addCase(checkAPIServer.pending, (state) => {
      state.globalLoader = true
    })
    builder.addCase(checkAPIServer.fulfilled, (state) => {
      state.globalLoader = false
      state.isServerDown = false
    })
    builder.addCase(checkAPIServer.rejected, (state) => {
      state.globalLoader = false
      state.isServerDown = true
    })
  },
})

export const loginHandler = createAsyncThunk(
  'auth/login',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let response = await NewAuth.basicAuth(payload)
      if (response.status === 200) {
        cookie.save('access_token', response.access_token, { path: '/' })
        cookie.save('refresh_token', response.refresh_token, { path: '/' })
        cookie.save('session_id', response.session_id, { path: '/' })
        let user = await NewAuth.getStore()
        dispatch(loginAction({ loggedIn: true, user: { ...user } }))
      } else {
        dispatch(
          showDialog({
            message: response.message,
            type: PopupType.DANGER,
            title: 'login error',
          }),
        )
        return rejectWithValue(response.message)
      }
    } catch (err) {
      dispatch(
        showDialog({
          message: 'you are not a seller',
          type: PopupType.DANGER,
          title: 'unauthorized',
        }),
      )
      return rejectWithValue(err.message)
    }
  },
)

export const getUser = createAsyncThunk(
  'auth/getUser',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      let user = await NewAuth.getStore()
      if (user?.id) {
        dispatch(loginAction({ loggedIn: true, user: { ...user } }))
      } else {
        dispatch(logout())
        dispatch(
          triggerToast({
            message: 'session has expired',
            type: PopupType.WARNING,
          }),
        )
        return rejectWithValue('session has expired')
      }
    } catch (error) {
      dispatch(triggerToast({ message: error.message, type: PopupType.WARNING }))
      dispatch(loginAction(initialState))
      return rejectWithValue(error.message)
    }
  },
)

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  await NewAuth.logout()
  dispatch(loginAction(initialState))
  const cookies = cookie.loadAll()
  Object.keys(cookies).forEach((key) => {
    cookie.remove(key, { path: '/' })
  })
  // history.push('/hello')
})

export const endSession = () => async (dispatch, state) => {
  dispatch(loginAction({ logged: false, user: {} }))
}

export const updateInfo = createAsyncThunk(
  'user/updateInfo',
  async (info, { dispatch, rejectWithValue, getState }) => {
    try {
      let { data, status, message } = await NewUpdate.updateInfo(info)
      dispatch(triggerToast({ type: PopupType.SUCCESS, message }))
      return data
    } catch (error) {
      dispatch(triggerToast({ type: PopupType.DANGER, message: error.message }))
      return rejectWithValue(error.message)
    }
  },
)

export const updateName = createAsyncThunk(
  'user/updateName',
  async (name, { dispatch, rejectWithValue, getState }) => {
    try {
      let { data, message } = await NewUpdate.updateStoreName({
        store_name: name,
      })
      dispatch(loginAction({ user: { ...getState().login.user, ...data } }))
      return data
    } catch (error) {
      dispatch(triggerToast({ type: PopupType.DANGER, message: error.message }))
      return rejectWithValue(error.message)
    }
  },
)

export const updateStorePicture = (data) => async (dispatch, state) => {
  try {
    let response = await NewUpdate.updateStorePicture(data)
    let { status } = response
    if (status === 200) {
      dispatch(
        loginAction({
          user: {
            ...state().login.user,
            store_picture: response.result.store_picture,
          },
        }),
      )
    }
  } catch (error) {
    console.log('🚀 ~ file: auth.js ~ line 88 ~ updateStorePicture ~ error', error)
  }
}

export const createStoreHandler = (payload) => async (dispatch, state) => {
  try {
    let res = await NewAuth.createStore(payload)
    let { result, message, status } = res
    if (status === 200) {
      dispatch(loginAction({ user: result, message: message }))
    } else {
      dispatch(loginAction({ message: res }))
    }
  } catch (error) {
    console.log('🚀 ~ file: auth.js ~ line 109 ~ createStoreHandler ~ error', error)
  }
}

export const verifiedEmailHandler = (payload) => async (dispatch, state) => {
  try {
    let res = await NewAuth.verifyEmail(payload)
    let { result, message, status } = res
    if (res.status === 200) {
      dispatch(loginAction({ user: result, message: message }))
    } else if (res.status === 403) {
      dispatch(loginAction({ message: message }))
    }
  } catch (error) {
    console.log('🚀 ~ file: auth.js ~ line 88 ~ updateStorePicture ~ error', error)
  }
}

export const updateVerificationCodeHandler = (payload) => async (dispatch, state) => {
  try {
    let res = await NewAuth.updateCode(payload)
    let { user: result, message, status } = res
    if (status === 200) {
      dispatch(loginAction({ user: result, message: message }))
    } else {
      dispatch(loginAction({ message: res.message }))
    }
  } catch (error) {
    console.log('🚀 ~ file: auth.js ~ line 131 ~ updateVerficationCodeHandler ~ error', error)
  }
}

export const provideReferenceHandler = (payload) => async (dispatch, state) => {
  try {
    let { status, message } = await NewAuth.provideReference(payload)
    if (status === 200) {
      dispatch(loginAction({ message: message }))
    } else {
      dispatch(loginAction({ message: message }))
    }
  } catch (error) {
    console.log('🚀 ~ file: auth.js ~ line 131 ~ updateVerficationCodeHandler ~ error', error)
  }
}

export const validateTokenHandler = (token) => async (dispatch, state) => {
  try {
    const { status, message } = await NewAuth.validateToken(token)
    if (status === 200) {
      dispatch(loginAction({ message: 'valid' }))
    } else {
      dispatch(loginAction({ message: 'invalid' }))
    }
  } catch (error) {
    console.log('🚀 ~ file: auth.js ~ line 162 ~ validateTokenHandler ~ error', error)
  }
}

export const resetPasswordHandler = (token, password) => async (dispatch, state) => {
  try {
    let { message, status } = await NewAuth.resetPassword(token, password)
    if (status === 200) {
      dispatch(loginAction({ message: message }))
    } else {
      dispatch(loginAction({ message: message }))
    }
  } catch (error) {
    console.log('🚀 ~ file: auth.js ~ line 176 ~ resetPasswordHandler ~ error', error)
  }
}

export const checkAPIServer = createAsyncThunk(
  'auth/checkAPI',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await NewAuth.checkAPI()
      const accessToken = cookie.load('access_token')
      if (accessToken) {
        dispatch(getUser())
      }
      return true
    } catch (error) {
      return rejectWithValue(error.message)
    }
  },
)

export default login.reducer
export const { loginAction, deleteMessage, logoutAction } = login.actions
