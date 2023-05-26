

export default class ApiService{

   constructor(){
      this.token = 
      'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NmFkZDM4ZmI5NmJkMTNhZGE1NzNkMWNjY2RlM2VkZiIsInN1YiI6IjY0NTg0MmY0NmFhOGUwMDBlNGJjMzhlNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.UjWs2wDA2vr7DEbed8goAYA7IIFjgtgaFz4iqKEvmBc';
      this.guestSessionId = '';
      this.baseUrl = 'https://api.themoviedb.org';
      this.apiKey = '46add38fb96bd13ada573d1cccde3edf'
   }
  

   async getResource(nameMovie='Better', page=1){
         const url = `${this.baseUrl}/3/search/movie?api_key=${this.apiKey}&language=en-US&query=${nameMovie}&page=${page}&include_adult=false`;

         const res = await fetch(url);
         
         if(!res.ok){
            throw new Error(`Could not fetch ${url} received ${res.status}`);
         }
         const dataOfMovies = await res.json();
         
        
         if(dataOfMovies.results.length === 0){
            throw new Error(`Could not fetch ${url} received 404`);
         }
         return dataOfMovies
   }

   async openGuestSession() {
      if (localStorage.getItem('guestSessionId')) {
        this.guestSessionId = localStorage.getItem('guestSessionId');
        return;
      }
  
      const resp = await fetch(`${this.baseUrl}/3/authentication/guest_session/new?api_key=${this.apiKey}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${this.token}`,
        },
      });
  
      const data = await resp.json();
  console.log(data,'open guest session');

      if (!resp.ok) {
        throw new Error(`${data.status_message}`);
      }
      this.guestSessionId = data.guest_session_id;
      localStorage.setItem('guestSessionId', data.guest_session_id);
    }
  



    async getRatedMovies(page = 1) {
      const resp = await fetch(
        `${this.baseUrl}/3/guest_session/${this.guestSessionId}/rated/movies?api_key=${this.apiKey}&page=${page}&sort_by=created_at.desc`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
          },
        }
      );
  
      const data = await resp.json();
  
      if (!resp.ok) {
        throw new Error(`${data.status_message}`);
      }
      return data;
    }


  
    async putRateMovie(id, value) {
      console.log(this.guestSessionId,'GUSETID')
      console.log(`${this.baseUrl}/3/movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${this.guestSessionId}`)
      const resp = await fetch(
        `${this.baseUrl}/3/movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${this.guestSessionId}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({ value }),
        }
      );
  
      const data = await resp.json();
  
      if (!data.success) {
        throw new Error(`${data.status_message}`);
      }
  
      return data;
    }
}

