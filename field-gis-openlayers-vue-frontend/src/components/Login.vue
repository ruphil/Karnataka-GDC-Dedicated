<template>
    <div id="loginsection" v-show="!loggedIn">
        <b>Kindly Login</b>
        <br/><br/>
        <input class="mobilenumber" type="text" size="20" placeholder="Username" v-model="username"/>
        <br/><br/>
        <input class="password" type="password" size="20" placeholder="Password" v-model="password" v-on:keyup.enter="doLogin"/>
        <br/><br/>
        <div style="font-size:10px;">{{ loginStatus }}</div>
    </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import mapStyler from '../composables/mapStyler';

import { defineComponent, ref, computed } from 'vue';
import axios from 'axios';

import VectorLayer from 'ol/layer/Vector';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';

export default defineComponent({
    setup() {
        const store = useStore();
        const { districtStyleFunction } = mapStyler();

        const loggedIn = computed(() => store.getters.getLoggedInStatus);

        const username = ref('');
        const password = ref('');
        const loginStatus = ref('Press Enter To Continue...');

        const doLogin = () => {
            axios({
                method: 'POST',
                url: 'http://localhost:8080/geoserver/ows?service=wfs&version=2.0.0&request=GetCapabilities',
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${username.value}:${password.value}`).toString('base64')}`
                }
            })
            .then((res) => {
                console.log(res.status);
                if(res.status == 200){
                    store.dispatch('setLoggedIn', true);
                    
                    const karndistbounds = new VectorLayer({
                        source: new VectorSource({
                            format: new GeoJSON(),
                            url: function (extent) {
                                return (
                                    'http://localhost:8080/geoserver/kgdc/ows?service=WFS&' +
                                    'version=1.0.0&request=GetFeature&typeName=kgdc:karndistbounds&' +
                                    'outputFormat=application/json&srsname=EPSG:32643&' +
                                    'bbox=' +
                                    extent.join(',') +
                                    ',EPSG:32643'
                                );
                            },
                            strategy: bboxStrategy,
                        }),
                        style: districtStyleFunction
                    });

                    const mapObj = store.getters.mapObj;

                    setTimeout(() => {
                        console.log(mapObj);    
                    }, 10000);
                    
                    // mapObj.addLayer(karndistbounds);
                    // store.dispatch('addMapLayersObj', {
                    //     'karnbounds': karndistbounds
                    // });
                }
            })
            .catch((reason: any) => {
                console.log(reason);
            })
            .finally(() => {
                username.value = '';
                password.value = '';
            })
        }

        return { loggedIn, username, password, loginStatus, doLogin }
    },
})
</script>