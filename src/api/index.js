/* eslint-disable newline-per-chained-call */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable quotes */
/* eslint-disable comma-dangle */
import vue from '../main.js'

const db = vue.$app.database()
export function getDatas(data) {
    return new Promise((resolve, reject) => {
        db.collection(data).get().then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function getDatasByOrder(data, fieldPath, order) {
    return new Promise((resolve, reject) => {
        db.collection(data).orderBy(fieldPath, order).get().then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function getDataWithId(data, id) {
    return new Promise((resolve, reject) => {
        db.collection(data).doc(id).get().then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function updateInfo(info, collection) {
    return new Promise((resolve, reject) => {
        db.collection(collection).doc(id).update(info).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function setInfo(info, collection) {
    const id = info._id
    console.log(id)
    delete info._id
    return new Promise((resolve, reject) => {
        console.log(info)
        db.collection(collection).doc(id).set(info).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function deleteInfo(info, collection) {
    return new Promise((resolve, reject) => {
        console.log('info', info)
        db.collection(collection).doc(info._id).remove().then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function addInfo(info, collection) {
    return new Promise((resolve, reject) => {
        db.collection(collection).add(info).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}


export function getCollectionCount(collection) {
    return new Promise((resolve, reject) => {
        db.collection(collection).count().then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function getCollectionCountWithParam(collection, param) {
    return new Promise((resolve, reject) => {
        db.collection(collection).where(param).count().then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}


export function getCollectionsWithParam(collection, param) {
    return new Promise((resolve, reject) => {
        db.collection(collection).where(param).get().then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function getCollectionsByPage(collection, page, limit) {
    return new Promise((resolve, reject) => {
        db.collection(collection).limit(limit).skip(page).get().then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function getCollectionsByPageWithParam(collection, page, limit, param) {
    return new Promise((resolve, reject) => {
        db.collection(collection).where(param).limit(limit).skip(page).get().then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export function getCollectionsByPageWithParamAndOrder(collection, page, limit, param, fieldPath, order) {
    return new Promise((resolve, reject) => {
        db.collection(collection).where(param).limit(limit).skip(page).orderBy(fieldPath, order).get().then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}
export function callCloudFunction(functionName, param) {
    return new Promise((resolve, reject) => {
        vue.$app.callFunction({
            name: functionName,
            data: param
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}