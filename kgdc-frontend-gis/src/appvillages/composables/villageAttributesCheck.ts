const villageAttributesCheck = () => {

    const checkVillageAttributesForLyrID = (reqdfeature: any) => {
        let attributes = reqdfeature.attributes;
        let conds = [];

        conds.push( 'abadilimitname'            in attributes && attributes['abadilimitname']            !=  ''  );
        conds.push( 'noofproperties'            in attributes && attributes['noofproperties']            !=  0   );
        // conds.push( 'startdate'                 in attributes && attributes['startdate']                 !=  ''  );
        // conds.push( 'enddate'                   in attributes && attributes['enddate']                   !=  ''  );
        conds.push( 'villagename'               in attributes && attributes['villagename']               !=  ''  );
        conds.push( 'lgdcode'                   in attributes && attributes['lgdcode']                   !=  ''  );
        conds.push( 'pocketscount'              in attributes && attributes['pocketscount']              !=  0   );
        conds.push( 'grampanchayat'             in attributes && attributes['grampanchayat']             !=  ''  );
        conds.push( 'hobli'                     in attributes && attributes['hobli']                     !=  ''  );
        conds.push( 'taluk'                     in attributes && attributes['taluk']                     !=  ''  ); 
        conds.push( 'userattributedistrictref'  in attributes && attributes['userattributedistrictref']  !=  ''  );

        return conds.every(Boolean);
    }

    return { checkVillageAttributesForLyrID }
}

export default villageAttributesCheck;