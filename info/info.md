// grab my profile info
https://www.theconcert.com/rest/users/profile?currency=thb&lang=en
Authorization: eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIyNDQ1NDMsImRhdGEiOnsicm9sZSI6ImFkbWluIiwiZ3JvdXAiOjF9LCJpYXQiOjE3NDQwMTUwMDYsImV4cCI6MTc0NjcwNTAwNn0.iUzQpYLR0pK2P1tqBY67LmWVmxEWE_4Tt4mhhZJ_mMq86WQpS3gATwLX1PTFZrfk
Header Token: eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIyNDQ1NDMsImRhdGEiOnsicm9sZSI6InVzZXIiLCJncm91cCI6MX0sImlhdCI6MTc0NDM0MTA2MSwiZXhwIjoxNzQ3MDMxMDYxfQ.PONArirdQFH51WzNICmTnTP_lR7SKW66aVhq5wTJo2wJpCKyGk4M_Pc1jPzThTE8

// grab all the info of the highlight concerts
https://cdn.theconcert.com/v3/concerts/en/highlight.json
// grab the basic info of the event id - 4036
https://apic.theconcert.com/v4/event/4036?lang=en&currency=THB
// check if has stages then it will have zones
https://apic.theconcert.com/v4/event/4036/stages
https://apic.theconcert.com/v4/event/4036/zones?lang=en&currency=THB
// all concert have stocks and variant
https://apic.theconcert.com/v4/event/4036/variants?currency=THB&lang=en&page=1
https://apic.theconcert.com/v4/event/4036/round?currency=THB&lang=en&page=1
https://apic.theconcert.com/v4/event/4036/variants/36653?lang=en&currency=THB


// grab user
wss://theconcert-production-user-db3.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-user-db3
// lternate namespace
// wss://s-apse1a-nss-2000.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-user-db3
{"t":"d","d":{"r":2,"a":"q","b":{"p":"/user/2244543","h":""}}}


// db for concert seats
// alternate namespace
// wss://s-apse1b-nss-203.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db0
// the "p" : "/seat/{concert_id}/{variant_id}
// use this message and find in all of the db, if fail it will return permission denied, go on the next db until the message is successful
wss://theconcert-production-db0.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db0
wss://theconcert-production-db1.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db1
wss://theconcert-production-db2.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db2
wss://theconcert-production-db3.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db3
wss://theconcert-production-db4.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db4
wss://theconcert-production-db5.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db5
wss://theconcert-production-db6.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db6
wss://theconcert-production-db7.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db7
wss://theconcert-production-db8.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db8
wss://theconcert-production-db9.asia-southeast1.firebasedatabase.app/.ws?v=5&ns=theconcert-production-db9
// {"t":"d","d":{"r":2,"a":"g","b":{"p":"/seat/4051/36755","q":{"l":80,"vf":"l","i":".key"}}}} optional query
{"t":"d","d":{"r":3,"a":"q","b":{"p":"/seat/4073/37963","h":""}}}

const token =
  "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIyNDQ1NDMsImRhdGEiOnsicm9sZSI6InVzZXIiLCJncm91cCI6MX0sImlhdCI6MTc0NDM0MTA2MSwiZXhwIjoxNzQ3MDMxMDYxfQ.PONArirdQFH51WzNICmTnTP_lR7SKW66aVhq5wTJo2wJpCKyGk4M_Pc1jPzThTE8"; // Your full bearer token
Request URL: https://www.theconcert.com/rest/seat/
Request Method: PUT
Authorization: bearer eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIyNDQ1NDMsImRhdGEiOnsicm9sZSI6InVzZXIiLCJncm91cCI6MX0sImlhdCI6MTc0NDM0MTA2MSwiZXhwIjoxNzQ3MDMxMDYxfQ.PONArirdQFH51WzNICmTnTP_lR7SKW66aVhq5wTJo2wJpCKyGk4M_Pc1jPzThTE8
Token: eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIyNDQ1NDMsImRhdGEiOnsicm9sZSI6InVzZXIiLCJncm91cCI6MX0sImlhdCI6MTc0NDM0MTA2MSwiZXhwIjoxNzQ3MDMxMDYxfQ.PONArirdQFH51WzNICmTnTP_lR7SKW66aVhq5wTJo2wJpCKyGk4M_Pc1jPzThTE8
Payload:
{"status":"hold","product_id":"4036","variant_id":36653,"variant_name":"SF-1 : มาม่า presents Move On จนโคจรมาเจอกัน Concert (ROUND 2)","seat_id":"id_1147113","seat_name":"AO67","device":"web","gToken":null}

Request URL: https://api.theconcert.com/carts
Request Method: POST
Payload:
{
  cart_id: 2244543,
  products: [
    {
      id: 4073,
      variant_id: 37963,
      quantity: 1,
      price: 1200,
      gate_open: "2025-04-26 06:00:00",
      zone: "A1",
      symbol: "฿",
      currency_code: "thb",
      seats: [{ key: "id_1163262", id: 1163262, name: "D3" }],
    },
  ],
  currency_code: "thb",
};

<!-- got seat -->
{
    "cart_id":2244543,
    "products":
    [
        {
            "id":4073,
            "variant_id":37963,
            "quantity":1,
            "price":1200,
            "gate_open":"2025-04-26 06:00:00",
            "zone":"A1",
            "symbol":"฿",
            "currency_code":"thb",
            "seats":
                    [
                        {
                            "key":"id_1163308",
                            "id":1163308,
                            "name":"G10"
                        }
                    ]
        }
    ],
    "currency_code":"thb"
}
<!-- no seat -->
{
    "cart_id":2244543,
    "products":
    [
        {
            "id":3874,
            "variant_id":36594,
            "quantity":1,
            "sku":"17 Aug บัตร JOY รอบ  EARLY BIRD (จำกัดอายุ 7 ปี ขึ้นไป)",
            "price":"฿799",
            "gate_open":"2025-08-17 08:00:00",
            "gate_close":"2025-08-17 23:00:00"
        }
    ]
}

Request URL: https://api.theconcert.com/users/checkout/2a054546ea6bc51c11f06a296e06c041?agent_id&payment_method=ccw&payment_provider=omise&promocode=&use_coins=false&use_insurance=true
Request Method: GET
Payload: agent_id&payment_method=ccw&payment_provider=omise&promocode=&use_coins=false&use_insurance=true

Request URL: https://vault.omise.co/tokens
Request Method: POST
Payload: {"card":{"name":"Jasper Tham",
    "number":"4693080252468539",
    "expiration_month":"10","expiration_year":"2027","security_code":"870","amount":222514}}

Request URL: https://www.theconcert.com/rest/placeorder
Request Method: PATCH
Payload:
{"user":{"first_name":"Jasper Sil Yung","last_name":"Tham","phone":"164928027","email":"jaspertham98@gmail.com","token":"eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIyNDQ1NDMsImRhdGEiOnsicm9sZSI6InVzZXIiLCJncm91cCI6MX0sImlhdCI6MTc0NDM0MTA2MSwiZXhwIjoxNzQ3MDMxMDYxfQ.PONArirdQFH51WzNICmTnTP_lR7SKW66aVhq5wTJo2wJpCKyGk4M_Pc1jPzThTE8"},"product_id":"4036","cart_id":"2a054546ea6bc51c11f06a296e06c041","order_ref_id":null,"lang":"en","payment_data":{"payment_id":"tokn_63cmm4vvgc3d9cijlck","source":null,"payment_provider":"omise","payment_method":"ccw","currency":"USD","mobile":"164928027","flow":"redirect"},"promocode":"","use_coins":false,"use_insurance":true,"webview":"","return_uri":"https://www.theconcert.com/checkout/callback","cart_expired":1744343339295,"shipping":null,"address":null,"agent_id":null,"csrf_token":"H2tKTce6-aQb8hnl_EjDPGeb9ogfdpSNWnBM","gToken":"03AFcWeA4lezHpNIhKHu0rtQKTHEmPkHER8XQhfKyBbc1CmVzM4MGH7ceuhW6GAszFpwiOaoYGAMv2VHt_Hcfsfkxz1iBLz3RCJQHGume-iTOC_C9Tp34Eo_QGBmbAtDL9TnRPSAg0k5dmzuQixjzasgLdSVupqE0JN7qBsSAodhqpBMXmKzQhDCsnJiJqtkntaEuSNO7aSlh2OQUdWCbYANGe8qg3UryL9RLZirN-91FzhP8FLLCYrbhH-7WDJ3FfNDwsEeAesJPCg8BzL76HI4T_dwTowvRbGsFXLJnR6BwU8BTJ7bDXOf1oUzYbuvuPpheazhBEZ54v38Tqsgp5fNd6UA2bUWv1KCZxjksSki7PqPgC-UbLCIfBzwSTnNEfJoKGvm01Qtz2WLKE4c2xZOMW2eKpTtn2Aig-FbIDKpEvmdsub4D6yKsMIBWWyx5VJ3NEPu2eV7kw3QbmLsy_XQKQjnjPImKqljbcala8jKqoSZgQa2BJDJuwyt-2mSjaZlvzV1-cRVVhfxn1YgFlbRJGUvREvSxHVL2jO3BDRJDlb1XvMh1K1KRejvoZop-z-dLG-XgOA7mhZ8w6g0w1XiZlQsxHO3CS4oMYfjWnHWv9CMUMsAgoIY6nm80jrfAmEauj9yTW6QjpTNesuTrpGxC12p0h5LAkdrCnEKP1Jp24GJqtwyk05rrhGoszjLBw2K2SU4Qz51ohfhMzxTkIhXLo5L-jiaT3e_hw_GVMZRQmntuP6EqQ87QXc6bIMEKkIFG7H91C0tsrjR4abcQSOTFVavIr8d9ryqMOm2ekUJLUhMuhU-zDwXlVv5d1yoT93bn0mvntoSQRN7rBPWqgwizeNNfQfOzVTT5fjnqjziCgzXmmUZnsFf0DTtEv-JY8B8pf9_3XT_0zbBU9VaolW1Bc76zSIrGTOfRcO3wRD2j_cNdvXvhSJo_2Jc7KOrykIEzXt-Q13EKAhlsVZipLbosjUZUu5wVPZi1gQdJGMAaR16qciEGenvbkUFLAzKB-zDvSwTI4l5QFWDN4x5eJ9myXwNPKskWutQRMJVdLgzvH0-fuiI_DMXQRmlXUK8kMYcLten3_dIEwBetEtsbFPZYvgopMmS00cYbxPipTt_yBIWgECdGVoqsQVbomD1IwyQaqGLI0tLSHOGjJTE1cJu2f7UOsTQBEAU7VeNf87lFxGRlKubcD1odtYemvlXsp_8c7osKdWor39Xd88b8UKyl4-HlO-18-ACB1kfOW58B51uD4Mg2nWl53hMv-DhH4UQkO3noN8qWLI8i0bnFFU3ujaB3__VSxjzjGgNjpLPxzVwvvATPcYySiOi1rMhs58TDcQx_IHC7EsLUVuFp2uAd9tuNc6WLV8yZiLg2timWB3EUjeRIukaZWTXQSGYl_ucPgjAuu8cQVCllNbaQc4KWOdnnZvc5Nd2cdaRGWlLlkB_SQM8_BLkTemIJdnbvSw0GmXj9XAQtMaTgPN7PUFSZU-lADR85AirpHDtEBGCtDTJ1AEpdosNmeHV0F5AuiMxifMGEy8EoaZ2wPEHxDR1Cy2EtwspyVpV8C4WxARek6sjYbI3sfBZIfCD4IpPw64pQxj_Zi9BlWZMJsoeBbSHUIYMX2pTHaYTMXnQSmlO8XwFFWvlSXqr1te7KOjTW_ybfmop4BXDAlwz3zKf8LXaV5IVw6ZIgpKclX6KpFO5cCbDI3Q4Ypp2TT51WuZeq6cZpdvh1UQlz_IhMmkoqo-IfUcmD1PdkzyzGQm3U2_APMx2ee-7IKjg-WdW7TVxeUzcp2VNqRDB61jdM_HYhJY2oGtieLWKJNdArcX15m1HDnpd2FaixfIVJAZM38HJlCqFyzKWD7ripy5jyERzkAe7XEryF4Jg6hnTSJuvUs6DyRJJ3NkhRcDIVIrvIVASS789TjIIi3Fx0b_8xGCYHaTWtVFl3DpKNbcyDmdRht6jYdNIlEI_WF_qzuqA5xy6Qf5ExbChPAcSKng8pdHIqzBrllKXTjjceGtg"}

Request URL: https://www.google.com/recaptcha/api2/reload?k=6LfzDAYqAAAAAE5S4koToDuZT_l0b6Fz15Nm5ThF
Request Method: POST
Payload: query string 6LfzDAYqAAAAAE5S4koToDuZT_l0b6Fz15Nm5ThF

Request URL: https://www.google.com/recaptcha/api2/userverify?k=6LfzDAYqAAAAAE5S4koToDuZT_l0b6Fz15Nm5ThF
Request Method: POST
Payload: query string 6LfzDAYqAAAAAE5S4koToDuZT_l0b6Fz15Nm5ThF

Request URL: https://www.theconcert.com/rest/human
Request Method: POST
Payload:
{"gToken":"03AFcWeA5LOelq8UgXb_0jwqTMu9EGkcAMOnkOarHXHhkMTT9tA5IkAmQ0gNq808OSd9tqGUslIUI5-Omx9lqb998tuKAJ40HZCiMGLc8Iy7MocZskUIuDyK6vGdP9-kla-ScDdVkjqHV5FeoUziqnRGsQOLASYh7V-ftUIRc1zlndOe-Hygjh-QXtVXO0PIfpfWXXGXOEln0a4sVKXBONxdU2jqj1zXwmAsXgi_xMUr4yyWmp2-ah5j4RscvNxLg4yTSnxg1bpo6G8oEKCRE1HfLm5jj2a9IAVNI8ubs0ybVyxsLmaooH3hB5uiT3N_uXBre1f9_Wo8YzuJqrqcGnlyDYaCPCeoZrs7GCV35OvVIpTHWafJ1giZtCoKMlGXK-4seHZBk9jsx3h9JEiEdMbw5UJr7CZ-CCMKYhmDvf5HH1yIAPsamOoJXIm-hKRaft7S2vR5Nka8VZok2UbC_YeLnYB8spGa6sw7s2hBZ6qTiXLdOvWIZQ_6lJPoAVPQPr2iZKGnv-4pqmcO2r6NKaNq670b8xwTE2-9lkpKAy3NLV1xB28qSutW6ap3WMEcue23E16CjpHcl2SQ_xlseRX3NKUJWiV4ocQfq4wVIMOZkRt_qhr3yoDBoKFE8ggdbkZ9iLD1Db88D_ZY4w4ByB6XBAJAJoTg1T2b4vlRqN8XNf3jV-cjAaG5vOBup46G2UC3ioiPnWjOCd7ZOQI_-XjUpErt5H4EWnnX_aRaK75KmRVw-JBAGKP_MYBivYllS4oU6Nwi5tp4jP6gQ0epwPXhyZ0D4u0mbTEQ0Ze08CAtXVLYczAxqOdi_X8eXYMRPwqZG43-MwrR7K7fPsrY5QpvBkFzyTY1ox1-Ijqnv9Kp1ko-OUNgd8zJIcXboDE_0Cds7JvKBKebcxSXDTUyHwKyfW4b5JwIKiER0gcvNTMHGuB2Kn3iJ3_frdK97DTTRyBIDNafiyNg4p0RWDk7kX1MWZPO4QTa2mlv0vE8KaBjn4dn6v3t1A0fqxlZtxBOmJaD_shQwF-qvxOa-G633vhT34Tozo-76Czpf6LjT6XctFaI1le60IZdOoGkMPYJuG4o1JlMnCyYg3F8XOcpdVDyGh26YApIOz2r2mq7XyMYrTO1I7aO0yTQfI0DIW4Nu7xyyBCMOT_U_qi4UjhkhZxDOiRF_aiz9PVmtq_yKAU3KGgI65vrIVlATAJ4QdS-wtZ9azzPa2j2r_2PoqywYwe9MB7AzLWSM5JBNMVULT5a9_nnXRt9dwtFLtqyoZLtNu60V7SJzfhcGedMJlL-us1IzIvnkHF7ek8lVotkox1kZ_gd8nCbBumLvy83hKEcpfBL0e4P2Zws9KQcvcEUVatYOo61IspNvzq3eFMbkv3KZlbLXjxG1RyF4mGmkNeIMFd8_uNmPukLpIQsz_bidM5iOrr2FihLxA34VUrnIm3NJISdGhctg9m4bn2MH35i8y5duJ98DrFraeKR_wmzGRluluO02pemg1I6yxMu_-be8fXgeTPjVIbLCyaZZ8TYyK5dSUmuJH60Eu29CvqjJF9FKhz8zsuXVCEWECOa7lNxtUUguwveySiFMkV1Q7hyTGG0oVfAku90XHR2hOIwhS1Rf7t2W3wl3KGHP7CYyK4hi43YiIbN96p4x_Xq7t_dWkctv9QVE5DeypJP4a-bXmVdkcJjrAsYRbN1YpiywNR9fGHbEKqme8yKxgmY9TMgl6ADkajFfzfBVgGQxyvKewUMUgyFouqzPYIWDmy1_sKvDpJ2_bQY24WqNcbmqO1op4iTOT4bTu9Jbe7FO4WQwOe4Ljg767VxBIEUjGcJ7OUL_ZtSiqWui4bEJFgmQAQmFucg1Yn5byaCMEBSUPCBYOF3Qv4OIuv70JZGJ_0dGyp8iaS3p8-Dary8qN5H0DV2MHO3uA17FHaH_QPaftRCJfoErAepLhwVqDlIypRCpj2sFc-tG1ZQLu0R6_hjPgGuCv7bhElYI6tckOWPcbeUVA5xpZ-O36vMWX6g","product_id":4036,"device":"web"}


Request URL:
https://api.theconcert.com/users/checkout/7fef4cbb6a7f60b8cf9ea392da08e436?agent_id&payment_method=ccw&payment_provider=omise&promocode=&use_coins=false&use_insurance=true
Request Method: GET
Payload: agent_id&payment_method=ccw&payment_provider=omise&promocode=&use_coins=false&use_insurance=true

Request URL: https://www.theconcert.com/rest/placeorder
Request Method: PATCH
Payload:
{
    "user": {
        "first_name": "Jasper Sil Yung",
        "last_name": "Tham",
        "phone": "164928027",
        "email": "jaspertham98@gmail.com",
        "token": "eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIyNDQ1NDMsImRhdGEiOnsicm9sZSI6InVzZXIiLCJncm91cCI6MX0sImlhdCI6MTc0NDM0MTA2MSwiZXhwIjoxNzQ3MDMxMDYxfQ.PONArirdQFH51WzNICmTnTP_lR7SKW66aVhq5wTJo2wJpCKyGk4M_Pc1jPzThTE8"
    },
    "product_id": "4073",
    "cart_id": "caf9a7bb2d9fb30f0e8158993c7e48a7",
    "order_ref_id": null,
    "lang": "en",
    "payment_data": {
        "payment_id": "tokn_63cpwdtnugjh9be3a6r",
        "source": null,
        "payment_provider": "omise",
        "payment_method": "ccw",
        "currency": "USD",
        "mobile": "164928027",
        "flow": "redirect"
    },
    "promocode": "",
    "use_coins": false,
    "use_insurance": true,
    "webview": "",
    "return_uri": "https://www.theconcert.com/checkout/callback",
    "cart_expired": 1744363621624,
    "shipping": null,
    "address": null,
    "agent_id": null,
    "csrf_token": "AbN3baMo-IyTnKN2JcqHIAr5v842hn-i4ReE",
    "gToken": "03AFcWeA4MQGB-a_xKycKlzdWlN-InR-yWZXLPEuzS2qj_sHtYDj23seUtELplq-ykekMqJtUs65j47Sx5P_FE1_dpmM_S_MU25CCQ_9VPx2q-CcibjpRC-5DCFj90cRmt7-f9M0NdUwZC3H6jUU-Wl1vLhtgmqP13Kbwbp8LawMXqCn3rpO5y_cv1egQz0QrRIBzgWcjzLASw9fIsOnCTO3pnxox7lremXr1OoraY2xLQeAc2JrFqVmHQkhbeYUOaIoMwMwJOJ7lRcEJRy_VAYLQkOe4evL2H6yHKPqth-ejgDsHX2Ky_0ZvOltwVGJEJXbGPbJzta8xSsTABg8psnJpTG1meftAFfTeMHbtzIrPhYhA41X6jLduxjbUWSrQJCEV5-rCBJyqvtM7GfY_9hhsKqRpffQonFZCJxfgP0TvvvzhLsCM3CG5Lb4s1vRXea5ZWY2ST0GMvbWBP9lXjF0GBRzvPfe0Pj4THgYoMyJxaSLgYNHne1Y9tWW67k8eWFv6cjL1NrRYg_4CC7J3I5ra0YxQoanQ32VMqXZvmh10wO7qaXhO8k4HLCREkqXQtdS9D4wzIEdGkyG_jHfYMC4ypSXT2B1BstQxz20L8OFK9v2_3cmgxJRoqU8ml_3qPIOHMYRdClHtYmShVx0w1pTwAnDS6BkWmFVyWlwZFZtu-AqMUnsxsrIQkuZId67VS7VAsrf4Vh8tzSDvUwpsoVgSQEtUPvn-9XfAkDhJodtXYtImgBD_DtuLF_7w5-_w0z3YutJUT7klUmkPwK-Wk_wuiHfo_6W9sTlutQKW0MD5eqQGArEeXellnZEgWS0Qb_7jhjGFSiVfBWGKoNJb8ivJxKq4bhrVLypVR-Xj_Crpscv3t4ABTvfE6UQrt5jgnwHWbBAwXPz9REziNzXfQ_FA6hnX2gxzLTMy285bqa-F6RpAulYlPAL3QbZxJlXegNvP7f-3kYprdpKLWtdextsaVLCaUdcUfnjanH4AHIOdHFQkoK-CM4DxK-Ngnl2a5XJzky7VD9YkN5Dw46ftaF0OUd8UQJ1nFaKlXA0XopwgxzT3_a5fCY3tSAgTNxyPUXL-krIsqpoI5WwRiStonZHCJ4rS8Pbf6G0waEZs6VP6b39LdOdOLYkJnE3g6Brt2qhJLrkziq2GQoi7LnfNchPNPPuG8GSdhxV6WTACUjiHQWiF1MQegFqhbgLHO2-2q-NbXGxIHk6CyTmwcNcRT97zuZZet9XLp8myIgN-hzAgCR4uu95-kH9SY9tseImot6naKO9ijC3lpjy-VyP1rGqZ-fq0-8d_lpllZ3t0QAb7zT0Zrqs1JTIcRFkPBS9izPwCbdH4CqrK7ndjnawKjmJIX-BY8fGb4HyM4yVa2DoRB39usPnDS5JUlTw_UKB5CMzxT8K3q0AhhU4Mn-FaOjZz0jFLuyzx9Vlm5UDmQiHS5__vJaIu-I9UWqkRUFqD-eE5Fmx5eNxyiBgo8w6NuAG9f2DLMLYJTmxsb9QosxNoiSXLMCzNC06pRtM6teQSi4r3Or6HmQ98jzqClbSwcywtgqH5ChMfKcDHsFme9Mw7xkINejTQoWGVoQWiCHxW7M7v6McJfMpe2R0E5JQUDTTYkI4JuOYj2r_r6CuVBRiblxQ4m9HlqqzPayuIf3Iwfpkxjm5z5qBuJuKU1GqOA31xCoFljLiHP0K2D-ogTvSIASq38ICEhHPhrAIA86Ninhqvvg07LMuE6TUINyF9pnBKGqLf6EBAfbRLPz_Fwfk9-nhOmjB8z_qa-PqsZ6VdaCNEpchwZFO8K5qf90sravAV4gq2qEbXSNTxhKr9a0BoYDuPz7pNL3s5Njy9GFw34a0mRpNhKFoO-Wp8DlDzag3ZYEDdwDI7_Otln79KfNKxfmOc-lYlMTehykwVGCqiDG3Vu0b1ygo63gJw9BJ5O4SEsFpGBe2slBqsh3Ju3r7L5TxtBds1rT2TdOY6_1zc2JdjoFSUgC_ng"
}

Request URL: https://3dsms.omise.co/payments/pay2_63cmovp5sfovpo2890k/authorize
Request Method: POST
Payload: {"areq":{"browserLanguage":"en-GB","browserJavascriptEnabled":true,"browserJavaEnabled":false,"browserColorDepth":24,"browserScreenHeight":1440,"browserScreenWidth":2560,"browserTZ":-480}}