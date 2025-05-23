// const BASE_URL = import.meta.env.VITE_BASE_URL
// const BASE_URL = "https://1d6d-111-68-111-216.ngrok-free.app/"
const BASE_URL = "http://localhost:8000/"


export const postApi = async (data, route) => {
    try{
        const response = await fetch(`${BASE_URL}${route}`, {
            method: 'POST',
            headers: {
              Accept: 'application.json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
          })

        if(response.ok){
            const jsonResponse = await response.json()
            return {success: true, data: jsonResponse}
        }
        return {success: false, error: response.message}
    }catch(err){
        console.log(err)
        return {success: false, error: err}
    }
}

export const getApi = async (id, route) => {
    try{
        console.log(`${BASE_URL}${route}/${id}`)
        const response = await fetch(`${BASE_URL}${route}/${id}`)

        if(response.ok){
            const jsonResponse = await response.json()
            return {success: true, data: jsonResponse}
        }
        return {success: false, error: "Something went wront in get method"}
    }catch(err){
        console.log(err)
        return {success: false, error: err}
    }
}

export const putApi = async (route, payload) => {
    try{
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        };

        const response = await fetch(`${BASE_URL}${route}`, requestOptions)
        if(response.ok){
            const jsonResponse = await response.json()
            return {success: true, data:jsonResponse.Data}
        }
        return {success: false, error: "Something went wrong with put method", }
    }catch(err){
        console.log(err)
        return {success: false, error: err}
    }
}

export const deleteApi = async (route, data) => {
    try{
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        };

        const response = await fetch(`${BASE_URL}${route}`, requestOptions)
        if(response.ok){
            const jsonResponse = await response.json()
            return {success: true, data:jsonResponse.Data}
        }
        return {success: false, error: "Something went wrong with delete method"}
    }catch(err){
        console.log(err)
        return {success: false, error: err}
    }
}

export const fetchAyatData = async (juzNo, surahId, ayatNo, route) => {
    try {
      const response = await fetch(
        `${BASE_URL}${route}?juzNo=${encodeURIComponent(juzNo)}&surahId=${encodeURIComponent(surahId)}&ayatNo=${encodeURIComponent(ayatNo)}`
      );
  
      const result = await response.json();
  
      if (!response.ok) {
        return { success: false, error: result.Error || result.Message };
      }

      return { success: true, data: result.Data };
    } catch (err) {
      console.error("Fetch error:", err);
      return { success: false, error: err.message };
    }
  };
  