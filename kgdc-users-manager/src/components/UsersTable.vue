<template>
    <div id="userstable" v-show="isLoggedIn">
        <button>Fetch Users</button><br/>
        <table>
            <tr>
                <td>jkl</td>
                <td>jkl</td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
import './UserTable.scss';
import { computed, defineComponent } from 'vue'
import store from '@/store';

export default defineComponent({
    setup() {
        const isLoggedIn = computed(() => store.getters.isLoggedIn);

        return { isLoggedIn };
    },
})
</script>
