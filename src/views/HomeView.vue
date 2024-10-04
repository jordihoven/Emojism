<template>
  <div class="app-container">
    <div class="search-wrapper">
      <div class="input-container">
        <input class="search" v-model="searchQuery" @input="searchQuery.length >= 3 && debouncedFetchEmojis()" placeholder="Search emoji by title or description..." />
        <LucideSearch class="icon search-icon"></LucideSearch>
      </div>
    </div>
    <div class="results-wrapper">
      <div v-if="loading" class="empty-state">
        <p class="medium">Loading emoji's...</p>
        <span class="research">Researches automatically when you change your searchterm ✨</span>
      </div>
      <div v-else-if="emojis.length" class="results-list">
        <div v-for="emoji in emojis" :key="emoji.slug" class="emoji-card" @click="copyToClipboard(emoji.character)">
         {{ emoji.character }}
        </div>
      </div>
      <div v-else class="empty-state">
        <p class="medium">Nothing to show</p>
        <span>Searches automatically when you finish typing... ✨</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useClipboard } from '@vueuse/core';
import { useDebounceFn } from '@vueuse/core';
import { toast } from 'toaster-ts'

export default {
  setup() {
    const searchQuery = ref('')
    const emojis = ref([])
    const loading = ref(false)
    const { copy } = useClipboard();

    const copyToClipboard = (emoji) => {
      copy(emoji)
      toast.success(`${emoji} copied to clipboard!`)
    };

    // Fetch movies from API
    const fetchEmojis = (async () => {
        loading.value = true
        try {
          const response = await axios.get(`/.netlify/functions/get-emojis?query=${searchQuery.value.trim()}`);
          emojis.value = response.data;
        } catch (error) {
          toast.error(`Error fetching emojis: ${error}`)
          console.error('Error fetching emojis:', error);
        } finally {
          loading.value = false
        }
    })

    const debouncedFetchEmojis = useDebounceFn(fetchEmojis, 1200);

    return {
      searchQuery,
      emojis,
      loading,
      debouncedFetchEmojis,
      copyToClipboard,
    }
  }
}
</script>

<style scoped lang="css">
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.results-wrapper {
  overflow: auto;
  padding: var(--m-spacing) var(--s-spacing) var(--xl-spacing) var(--s-spacing);
}

.search-wrapper {
  border-bottom: 1px solid var(--stroke);
  padding: var(--s-spacing);
}

.search {
  background-color: var(--bg-primary);
  border: 1px solid var(--stroke);
  border-radius: var(--radius);
  font-size: var(--body);
  font-weight: var(--medium);
  width: 100%;
  transition: var(--transition);
  padding: var(--xs-spacing) var(--xs-spacing) var(--xs-spacing) 28px;
}
.search:hover {
  border: 1px solid var(--primary);
  background-color: var(--bg-secondary);
  box-shadow: var(--box-shadow);
}

.input-container {
  position: relative;
}

.search-icon {
  position: absolute;
  left: var(--xs-spacing); /* Adjust to position the icon correctly */
  top: 50%;
  transform: translateY(-50%); /* Center icon vertically */
  pointer-events: none; /* Prevent icon from blocking clicks on input */
}

.emoji-card {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--s-spacing);
  border: 1px solid var(--stroke);
  border-radius: var(--radius);
  padding: var(--xs-spacing);
  background-color: var(--bg-primary);
  transition: var(--transition);
}
.emoji-card:hover {
  cursor: pointer;
  border-color: var(--primary);
  background-color: var(--bg-secondary);
  box-shadow: var(--box-shadow);
}

.emoji-card img {
  border-radius: var(--radius);
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0 0 8px var(--bg-secondary); /* TODO: find a subtle dropshadow color that works on light & darkmode */
}

.results-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: var(--xs-spacing);
  margin: 0 auto;
  max-width: 60rem;
}

.input-container {
  max-width: 60rem;
  display: flex;
  margin: 0 auto;
}

.empty-state {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
  margin: 0 auto;
  max-width: 60rem;
  align-items: center;
}
.empty-state span {
  text-align: center;
}
</style>
