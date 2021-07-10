<template>
    <div id="userattributescontainer" v-show="showUserAttributesTable">
        <div class="userattributestable">
            <div>
                <div>Feature Name</div>
                <div>{{ currentFeatureName }}</div>
            </div>
            <div>
                <div>Abadi Limit Name</div>
                <div><input type="text" v-model="abadilimitname"></div>
            </div>
            <div>
                <div>No. of Properties / Houses</div>
                <div><input type="number" v-model="noofproperties"></div>
            </div>
            <div>
                <div>Date of Commencement of Marking</div>
                <div><input type="date" v-model="startdate"></div>
            </div>
            <div>
                <div>Date of Completion of Marking</div>
                <div><input type="date" v-model="enddate"></div>
            </div>
            <div>
                <div>Village Name</div>
                <div><input type="text" v-model="villagename"></div>
            </div>
            <div>
                <div>LGD Code</div>
                <div><input type="text" v-model="lgdcode"></div>
            </div>
            <div>
                <div>
                    <span>Total Abadi Areas Count in Village</span><br> 
                    <span style="font-size:0.8em;">Hamlets + Main Village Settlements Count</span>
                </div>
                <div><input type="number" v-model="pocketscount"></div>
            </div>
            <div>
                <div>Gram Panchayat</div>
                <div><input type="text" v-model="grampanchayat"></div>
            </div>
            <div>
                <div>Hobli</div>
                <div><input type="text" v-model="hobli"></div>
            </div>
            <div>
                <div>Taluk</div>
                <div><input type="text" v-model="taluk"></div>
            </div>
            <div>
                <div>District</div>
                <select v-model="userattributedistrictref">
                    <option disabled value="">Select District</option>
                    <option v-for="(district, index) in districtsList" v-bind:key="index">{{ district }}</option>
                </select>
            </div>
            <div>
                <div><button class="userattributesclose" v-on:click="updateUserAttributes">Update Attributes</button></div>
                <div><button class="userattributesclose" v-on:click="showUserAttributesTable = false">Close</button></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import store from '@/shared/store';
import { computed, defineComponent, onMounted, ref } from 'vue';

import './UserAttributes.scss';

import globalToast from '@/shared/composables/globalToast';
import abadiLimitUploader from '@/shared/composables/abadiLimitUploader';

export default defineComponent({
    setup() {
        const { showGlobalToast } = globalToast();
        const { tryToUploadAbadiLimit } = abadiLimitUploader();

        const featuresData = computed(() => store.getters.getFeaturesData);

        const currentFeatureID = ref('');
        const currentFeatureName = ref('');

        const abadilimitname              = ref('');
        const noofproperties              = ref(0);
        const startdate                   = ref();
        const enddate                     = ref();
        const villagename                 = ref('');
        const lgdcode                     = ref('');
        const pocketscount                = ref(0);
        const grampanchayat               = ref('');
        const hobli                       = ref('');
        const taluk                       = ref('');
        const userattributedistrictref    = ref('');
        
        const return1 = { 
            currentFeatureName,
            abadilimitname, noofproperties, startdate, enddate, villagename, lgdcode,
            pocketscount, grampanchayat, hobli, taluk, userattributedistrictref 
        };
        
        const showUserAttributesTable = ref(false);
        const editAttributes = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');
            // console.log(lyrid);
            currentFeatureID.value = lyrid;
            let reqdfeature: any = featuresData.value.find((feature: any) => {
                return feature.lyrid == lyrid;
            });

            currentFeatureName.value = reqdfeature.featurename;

            let attributes = reqdfeature.attributes;
            // console.log(reqdfeature, attributes);

            if (typeof attributes === 'object'){
                if ('lgdcode'                   in attributes) lgdcode.value                    = attributes['lgdcode'];
                if ('abadilimitname'            in attributes) abadilimitname.value             = attributes['hamletname'];
                if ('noofproperties'            in attributes) noofproperties.value             = attributes['noofproperties'];
                if ('startdate'                 in attributes) startdate.value                  = attributes['startdate'];
                if ('enddate'                   in attributes) enddate.value                    = attributes['enddate'];
                if ('villagename'               in attributes) villagename.value                = attributes['villagename'];
                if ('pocketscount'              in attributes) pocketscount.value               = attributes['pocketscount'];
                if ('grampanchayat'             in attributes) grampanchayat.value              = attributes['grampanchayat'];
                if ('hobli'                     in attributes) hobli.value                      = attributes['hobli'];
                if ('taluk'                     in attributes) taluk.value                      = attributes['taluk'];
                if ('userattributedistrictref'  in attributes) userattributedistrictref.value   = attributes['userattributedistrictref'];
            
                showUserAttributesTable.value = true;
            }
        }

        const updateUserAttributes = () => {
            const attributes = {
                'lgdcode'                   :   lgdcode.value                   ,   
                'abadilimitname'            :   abadilimitname.value            ,
                'noofproperties'            :   noofproperties.value            ,
                'startdate'                 :   startdate.value                 ,
                'enddate'                   :   enddate.value                   ,
                'villagename'               :   villagename.value               , 
                'pocketscount'              :   pocketscount.value              , 
                'grampanchayat'             :   grampanchayat.value             , 
                'hobli'                     :   hobli.value                     , 
                'taluk'                     :   taluk.value                     , 
                'userattributedistrictref'  :   userattributedistrictref.value
            }

            let lyrid = currentFeatureID.value;
            // console.log(lyrid);
            let reqdfeature: any = featuresData.value.find((feature: any) => {
                return feature.lyrid == lyrid;
            });

            currentFeatureName.value = reqdfeature.featurename;
            
            reqdfeature.attributes = attributes;
            showGlobalToast('Attributes Updated...');
        }

        const checkAttributesForLyrID = (lyrid: any) => {
            let reqdfeature: any = featuresData.value.find((feature: any) => {
                return feature.lyrid == lyrid;
            });

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

        const whetherAttributesValidComputed = computed(() => {
            return (lyrid: any) => {
                let whetherValid = checkAttributesForLyrID(lyrid);
                if(whetherValid){
                    return '<span style="color:green;">OK</span>';
                } else {
                    return '<span style="color:red;">Not OK</span>';
                }
            }
        });

        const return2 = { 
            showUserAttributesTable, 
            editAttributes, updateUserAttributes, 
            whetherAttributesValidComputed 
        };

        const callUploadAbadiLimit = (e: any) => {
            let lyrid = e.target.getAttribute('lyrid');
            // console.log(lyrid);

            let whetherValid = checkAttributesForLyrID(lyrid);
            if(whetherValid){
                tryToUploadAbadiLimit(lyrid);
            } else {
                showGlobalToast('Kindly Edit Attributes for the feature');
            }
        }

        const toggleFileUploader = () => {
            console.log('toggling fileuplaoder');
            console.log(store.getters.getShowFilesUploader);

            store.dispatch('setShowFilesUploader', !store.getters.getShowFilesUploader);
        }

        const toggleFilesLoader = () => {
            console.log('toggling filesloader');
            console.log(store.getters.getShowFilesLoader);

            store.dispatch('setShowFilesLoader', !store.getters.getShowFilesLoader);
        }

        const return3 = { callUploadAbadiLimit, toggleFileUploader, toggleFilesLoader };

        return {
            return1, return2, return3
        }
    },
})
</script>