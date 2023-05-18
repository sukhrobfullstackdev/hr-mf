import React, {useEffect, useState} from "react";
import {dates,EIMZOClient} from "./services/eImzoClient";


function useEimzo(props){
    const [state,setState] = useState({
        EIMZO_MAJOR: 3,
        EIMZO_MINOR: 37,
        items: [],
        pkcs7_64: null
    });
    const {EIMZO_MAJOR, EIMZO_MINOR, items, pkcs7_64} = state;
    const checkKey = (item)=>{
        item.expired = dates.compare(new Date(), item.validTo) < 0;
        return item
    }
    const loadKeys = function(){
        // uiClearCombo();
        EIMZOClient.listAllUserKeys(function(o, i){
            var itemId = "itm-" + o.serialNumber + "-" + i;
            return itemId;
        },function(itemId, v){
            // Barcha kalitlarni bitta bitta chiqaradi
            // Kalitlarni aktiv no activligini tekshirish
            const checkItem = checkKey(
                {
                    ...v,
                    itemId: itemId
                }
            )
            return checkItem
        },function(items, firstId){
            //Barcha kalitlarni statega yozish (active no active kalitlar expired bilan farq qiladi)
            setState({
                ...state,
                items: items
            })
        },function(e, r){

        });
    }
    const getItem = (item)=>{
        EIMZOClient.loadKey(item, function (id) {
                EIMZOClient.createPkcs7(id, item.TIN, null, function (pkcs7) {
                        setState({
                            ...state,
                            pkcs7_64: pkcs7
                        })
                    }, function (e, r) {
                        if (r) {
                           // console.log(`Error createPkcs7 two r: `,r);
                        }
                        if (e){
                            // console.log(`Error createPkcs7 two e: `,e);
                        }
                    });
                }, function (e, r) {
                    if (r) {
                        // console.log(`Error loadKey two r: `,r);
                    }
                    if (e) {
                        // console.log(`Error loadKey two e: `, e);
                    }
                });
    }
    const onConfirm = (key,text)=>{
        EIMZOClient.loadKey(key,(id)=>{
            EIMZOClient.createPkcs7(id, text, null, function(pkcs7) {
                setState({
                    ...state,
                    pkcs7_64: pkcs7
                })
            }, function(e, r) {
                if (r) {
                    if (r.indexOf("BadPaddingException") != -1) {

                    } else {

                    }
                } else {

                }
            });
        })
    }
    useEffect(()=>{
        EIMZOClient.API_KEYS = [
            'hr.mf.uz', '62B06921F16458333373615BDDBA454DFCB04F74589EFACBB0807992DEBD1E537767F092E2CB1CCCDCE29B2A702FA34B3BA11A1EAF33CB4DE0201E2A0FAFE2B7',
        ];
        EIMZOClient.checkVersion(function(major, minor){
            var newVersion = EIMZO_MAJOR * 100 + EIMZO_MINOR;
            var installedVersion = parseInt(major) * 100 + parseInt(minor);
            if(installedVersion < newVersion) {
                // console.log('Places update app!')
            } else {
                EIMZOClient.installApiKeys(function(){
                    loadKeys();
                },function(e, r){
                    if(r){
                        // console.log('Install Api keys r:', r)
                        // uiShowMessage(r);
                    } else {
                        // console.log('Install Api keys error:', e)
                        // wsError(e);
                    }
                });
            }
        },
            function(e, r){
            if(r){
                // console.log('Check versions r message', r);
            } else {
                // console.log('Check versions error message', e);
            }
        });
    },[]);
    return [items, pkcs7_64, getItem, onConfirm];
}
export default useEimzo;