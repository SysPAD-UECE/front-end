<template>

  <q-card class="text-h5 ">
    Projeto de Proteção de Dados baseado em Técnicas de Anonimização

  </q-card>
  <div class="q-pa-md row">
    <q-card class="my-card text-white col">
      <q-card-section>
        <div class="text-h6">This brings an innovative way to protect customers from other entities that may be users of
          private entities for various government entities, through anonymization and processing in techniques. This
          advances the state-of-the-art and existing solutions do not address data privacy mitigation and help companies
          and government entities to comply with privacy laws.</div>
      </q-card-section>

    </q-card>

    <q-card class="my-card text-white col">
      <q-card-section>
        <div class="q-pa-md">
    <q-video  :ratio="16/9"
      src="https://www.youtube.com/embed/uHKfrz65KSU"
    />
  </div>
  <q-card-section class="row justify-around">
  <div class="col">
    <q-btn>GIT HUB</q-btn>
  </div>
  <div class="col">
    <q-btn>LARCES</q-btn>
  </div>
</q-card-section>
      </q-card-section>

    </q-card>
  </div>
</template>
<script>

import { defineComponent } from 'vue'


export default defineComponent({
  name: 'home',


  methods: {
  },
  data() {
    return {

    }
  },
  mounted() {
  }
})
</script>


