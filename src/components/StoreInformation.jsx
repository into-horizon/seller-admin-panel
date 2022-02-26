import React, { useEffect, useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { CFormFloating, CFormInput, CFormLabel, CButton } from '@coreui/react';
import { useTranslation } from 'react-i18next';
import { usePopup, DialogType } from "react-custom-popup";
import { updateInfo, updateName } from "../store/auth"

const ProfileInfo = props => {
    const { updateInfo, updateName } = props
    const { showOptionDialog, showToast } = usePopup();
    const { t } = useTranslation('translation', { keyPrefix: 'profile' });
    const [info, setInfo] = useState({})
    const [arr, setArr] = useState([])
    let initialInfo = useSelector(state => ({ user: state.login.user }))
    const cancelHandler = () => {
        setInfo(initialInfo.user)
        let newObj = { ...initialInfo.user }
        delete newObj['id']
        delete newObj.profile_id
        delete newObj.name_is_changed
        delete newObj.created_at
        delete newObj.store_picture
        delete newObj.status
        delete newObj.rejected_reason
        delete newObj.store_rating
        delete newObj.access_token
        delete newObj.refresh_token

        setArr(arr => Object.keys(newObj))
    }
    const updateHandler = () => {
        showOptionDialog({
            containerStyle: { width: 350 },
            text: t('confirmMessage'),
            title: t('updateTitle'),
            options: [
                {
                    name: t('cancel'),
                    type: 'cancel',
                },
                {
                    name: t('update'),
                    type: 'confirm',
                    style: { background: 'lightcoral' },
                },
            ],
            onConfirm: () => {
                updateInfo(info)
                if (info.store_name !== initialInfo.user.store_name) {
                    updateName(info.store_name)
                }
                return (

                    showToast({
                        type: DialogType.SUCCESS,
                        text: t('doneUpdating'),
                        timeoutDuration: 3000,
                        showProgress: true,
                    })

                )

            }
        })
    }
    useEffect(() => {
        setInfo(initialInfo.user)
        let newObj = { ...initialInfo.user }
        delete newObj['id']
        delete newObj.profile_id
        delete newObj.name_is_changed
        delete newObj.created_at
        delete newObj.store_picture
        delete newObj.status
        delete newObj.rejected_reason
        delete newObj.store_rating
        delete newObj.access_token
        delete newObj.refresh_token

        setArr(arr => Object.keys(newObj))
    }, [])

    const changeHandler = e => {
        let newObj = { ...info }
        newObj[e.target.name] = e.target.value
        setInfo(i => newObj)
    }
    return (
        <>
            <h3>information</h3>
            {arr.map(value =>

                <CFormFloating className="mb-3" key={value}>
                    <CFormInput type="text" id="floatingInput" name={value} value={info[value]} onChange={changeHandler} disabled={value === 'store_name' || value === 'city' ? value === 'city' ? true : info.name_is_changed : false} />
                    <CFormLabel htmlFor="floatingInput">{t(`${value}`)}</CFormLabel>
                </CFormFloating>
            )}

            <CButton color="primary" onClick={updateHandler}>{t('update')}</CButton>
            <CButton color="light" onClick={cancelHandler}>{t('cancel')}</CButton>

        </>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = { updateInfo, updateName }

export default connect(mapStateToProps, mapDispatchToProps)(ProfileInfo);
