<template>
  <div class="app-container">
    <div class="search-wrapper">
      <div class="input-container">
        <input class="search" v-model="searchQuery" @input="fetchEmojis" placeholder="Search emoji by title or description..." />
        <LucideSearch class="icon search-icon"></LucideSearch>
      </div>
    </div>
    <div class="results-wrapper">
      <div v-if="loading" class="empty-state">
        <p class="medium">Loading emoji's...</p>
        <span class="research">Researches automatically when you change your searchterm ✨</span>
      </div>
      <div v-else-if="emojis.length" class="results-list">
        <div v-for="emoji in filteredEmojis" :key="emoji.slug" class="movie-card">
          <span>{{ emoji.character }}</span>
          {{ emoji.unicodeName }}
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
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const searchQuery = ref('')
    const emojis = ref([])
    const error = ref(null)
    const loading = ref(false)

    const filteredEmojis = computed(() => {
      return emojis.value.filter((emoji) =>
        emoji.unicodeName.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

     // Fetch emojis on component mount
     onMounted(() => {
      fetchEmojis();
    });

    // Fetch movies from API
    const fetchEmojis = (async () => {
        loading.value = true

        const query = searchQuery.value.trim()

        const url = query
        ? `/.netlify/functions/get-emojis?query=${query}`
        : `/.netlify/functions/get-emojis`;

        try {
          const response = await axios.get(url);
          emojis.value = response.data;
          error.value = null;
        } catch (error) {
          console.error('Error fetching emojis:', error);
        } finally {
          loading.value = false
        }
    })

    return {
      searchQuery,
      emojis,
      error,
      loading,
      filteredEmojis,
      fetchEmojis,
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

.movie-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--s-spacing);
  transition: var(--transition);
  border: 1px solid var(--stroke);
  border-radius: var(--radius);
  padding: var(--xs-spacing);
  background-color: var(--bg-primary);
}
.movie-card:hover {
  filter: brightness(98%);
}

.movie-details {
  display: flex;
  gap: var(--s-spacing);
  justify-content: center;
  align-items: center;
}
.movie-detail {
  display: flex;
  align-items: center;
  gap: var(--xs-spacing);
  padding: 4px;
  background-color: var(--bg-secondary);
  border-radius: var(--radius);
  width: fit-content;
}

.name-rating-duration {
  display: flex;
  flex-direction: column;
  gap: var(--xs-spacing);
}

/* TODO: figure out a way to have responsive images playing nicely... */
.movie-img {
  flex-shrink: 0;
  width: 4rem;
  aspect-ratio: 2 / 3;
}
.movie-card img {
  border-radius: var(--radius);
  width: 100%;
  height: 100%;
  object-fit: cover;
  box-shadow: 0 0 8px var(--bg-secondary); /* TODO: find a subtle dropshadow color that works on light & darkmode */
}

.movie-card .no-poster {
  background-color: var(--bg-secondary);
  height: 100%;
  border-radius: var(--radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.results-list {
  flex-direction: column;
  gap: var(--xs-spacing);
}
.results-list,
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

.details {
  display: flex;
  gap: var(--xs-spacing);
}
</style>
