<template>
   <q-card class="text-h5 q-pa-sm q-pl-md q-ma-md">
    About Data Protection Project 
  </q-card>
  <div class="q-pa-md row">
    <q-card class="my-card text-white col q-mr-md">
      <q-card-section>
        <div class="text-h6">This brings an innovative way to protect customers from other entities that may be users of
          private entities for various government entities, through anonymization and processing in techniques. This
          advances the state-of-the-art and existing solutions do not address data privacy mitigation and help companies
          and government entities to comply with privacy laws.</div>
      </q-card-section>

    </q-card>

    <div class="my-card text-white col">
      <q-card-section>
        <div class="q-pa-md">
          <q-video :ratio="16 / 9" src="" />
        </div>
        <q-card-section class="row justify-around">
          
            <q-btn    target="_blank" href="https://github.com/FRIDA-LACNIC-UECE">GIT HUB</q-btn>
          
            <q-btn   >LARCES</q-btn>
          
        </q-card-section>
      </q-card-section>
    </div>
  </div>

  <div class="col q-ma-md">
    <q-card-section>
      <q-card-section class="row justify-around">
        <q-btn  color="primary"  to="/client/databases">View Databases</q-btn>
      <q-btn  color="primary" to="client/anonymization">Configure Anonymization</q-btn>
      <q-btn  color="primary" >Install Agent</q-btn>
      </q-card-section>
    
    </q-card-section>
  </div>
</template>
<script>

import { defineComponent } from 'vue'


export default defineComponent({
  name: 'home'
})
</script>


