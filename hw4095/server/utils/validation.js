function bodyValidation(reqBody) {

    let errors=[];

    if ( !reqBody.method )
        errors.push({field:'method',errorMess:'fill up field'});

    if ( !reqBody.url )
        errors.push({field:'url',errorMess:'fill up field'});


    return errors;
}

export {bodyValidation};