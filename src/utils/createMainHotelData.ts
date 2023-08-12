export let createMainHotelData=(data:any):any=>{
    console.log("aaaaaaaaaaaa",[...data.hotelsList[0].hotelAllRoomTypes])
    let info={
        "country": data.country,
        "state": data.state,
        "city": data.city,
        "hotelsList": [

            {
                "hotelName": data.hotelsList[0].hotelName,
                "hotelId": data.hotelsList[0].hotelId,
                "hotelAddress": data.hotelsList[0].hotelAddress,
                "hotelPrice": data.hotelsList[0].hotelPrice,
                "originalHotelPrice": data.hotelsList[0].originalHotelPrice,
                "hotelToolTipDescription": data.hotelsList[0].hotelToolTipDescription,
                "hotelFulladdress": data.hotelsList[0].hotelFulladdress,
                "breakfastInfo": data.hotelsList[0].breakfastInfo,
                "cancellationMsg": data.hotelsList[0].cancellationMsg,
                "games":data.hotelsList[0].games ,
                "hotelImage": data.hotelsList[0].hotelImage,
                "hotelRelatedImages": {...data.hotelsList[0].hotelRelatedImages},
    
                "rating": data.hotelsList[0].rating,
                "hotelType": data.hotelsList[0].hotelType,
                "HotelStatus": data.hotelsList[0].HotelStatus,
                "hotelReviews": data.hotelsList[0].hotelReviews,
                "hotelDescription": data.hotelsList[0].hotelDescription,
                "facilities": [...data.hotelsList[0].facilities],
                "hotelAllRoomTypes": [
                    {
                        "hotelType": data.hotelsList[0].hotelAllRoomTypes[0].hotelType,
                        "hotelImage": data.hotelsList[0].hotelAllRoomTypes[0].hotelImage,
                        "hotelRoomSize": data.hotelsList[0].hotelAllRoomTypes[0].hotelRoomSize,
                        "hotelRoomBedType": data.hotelsList[0].hotelAllRoomTypes[0].hotelAllRoomTypes,
                        "hotelsCategories": [
                            {
                                "hotelFacility": [...data.hotelsList[0].hotelAllRoomTypes[0].hotelsCategories[0].hotelFacility],
                                "hotelCategoryTypeTitle": data.hotelsList[0].hotelAllRoomTypes[0].hotelsCategories[0].hotelCategoryTypeTitle,
                                "hotelOriginalPrice":data.hotelsList[0].hotelAllRoomTypes[0].hotelsCategories[0].hotelOriginalPrice ,
                                "hotelDiscountPrice": data.hotelsList[0].hotelAllRoomTypes[0].hotelsCategories[0].hotelDiscountPrice,
                                "hotelTaxesPrice": data.hotelsList[0].hotelAllRoomTypes[0].hotelsCategories[0].hotelTaxesPrice
                            }
                        ]
                    }
                ],
                "houserules": {...data.hotelsList[0].houserules},
                "packageOptions": [
                    {
                        "packageName":data.hotelsList[0].packageOptions[0].packageName ,
                        "packageTime": data.hotelsList[0].packageOptions[0].packageTime,
                        "packageOriginalPrice": data.hotelsList[0].packageOptions[0].packageOriginalPrice,
                        "packageDiscountPrice": data.hotelsList[0].packageOptions[0].packageDiscountPrice,
                        "packagePersions": data.hotelsList[0].packageOptions[0].packagePersions,
                        "packageId": data.hotelsList[0].packageOptions[0].packageId,
                        "packageDescription": data.hotelsList[0].packageOptions[0].packageDescription
                    }
          
                ]
        
            }
            ]
    }
    return info

}