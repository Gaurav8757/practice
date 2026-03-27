// Browser context (using axios from CDN)
const api = axios.create({
    baseURL: "https://dummyjson.com",
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
    },
});

const testApi = function (url) {
    fetch(`${url}/test`).then((res) => res.json()).then((data) => {
        showData(data);
    }).catch((err) => {
        console.log(err);
    }).finally(() => {
        console.log("API call completed");
    })
};

const testApi2 = async (url) => {
    try {
        // const res = await fetch(`${url}/test`);
        const res = await api.get(`${url}/test`);
        // const data = await res.json();
        showData(res.data);
    } catch (err) {
        console.log(err);
    } finally {
        console.log("API call completed");
    }
};

// testApi(URL);
// testApi2("/test");



// AUTH API

const getProducts = async (query, limit = 1, skip = 2, sortBy = "") => {
    try {
        const res = await fetch(`https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}&sortBy=${sortBy}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
        showData(data);
    } catch (err) {
        console.log(err);
    } finally {
        console.log("API call completed");
    }
};

const getAxiosProducts = async (query, limit = 1, skip = 2, sortBy = "") => {
    try {
        const res = await api.get(`/products/search?q=${query}&limit=${limit}&skip=${skip}&sortBy=${sortBy}`);
        showData(res.data);
    } catch (err) {
        console.log(err);
    } finally {
        console.log("Axios API call completed");
    }
};





// --- Pagination State ---
let currentQuery = "FRUITS";
let currentLimit = 1; // 1 item per page by default
let currentSkip = 0;

// --- API Functions ---
function getPromiseProducts(query, limit = 1, skip = 0, sortBy = "") {
    return new Promise((resolve, reject) => {
        const url = `https://dummyjson.com/products/search?q=${query}&limit=${limit}&skip=${skip}&sortBy=${sortBy}`;
        fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        })
        .then((res) => res.json())
        .then((data) => resolve(data))
        .catch((err) => reject(err));
    });
}

// Helper to Load and Render
const loadProducts = async (query, limit, skip) => {
    try {
        currentQuery = query;
        currentLimit = limit;
        currentSkip = skip;
        
        console.log(`Fetching: ${query}, skip: ${skip}, limit: ${limit}`);
        const data = await getPromiseProducts(query, limit, skip);
        showData(data);
    } catch (err) {
        console.error("Error loading products:", err);
        document.getElementById("result").innerHTML = "Error loading data.";
    }
};

// --- UI Rendering ---
function showData(data) {
    const resultDiv = document.getElementById("result");
    
    // 1. Render Product List
    const productsHtml = data.products.length > 0 
        ? data.products.map((product) => `
            <div style="border-bottom: 1px solid #ddd; padding: 15px 0;">
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <img src="${product.thumbnail}" alt="${product.title}" style="max-height: 150px; border-radius: 8px;">
            </div>
        `).join("")
        : "<p>No products found.</p>";

    // 2. Pagination Logic
    const hasPrevious = data.skip > 0;
    const hasNext = (data.skip + data.limit) < data.total;
    const currentPage = Math.floor(data.skip / data.limit) + 1;
    const totalPages = Math.ceil(data.total / data.limit);

    const paginationHtml = `
        <div class="pagination-controls" style="margin-top: 30px; display: flex; align-items: center; gap: 20px;">
            <button ${!hasPrevious ? 'disabled' : ''} 
                onclick="loadProducts('${currentQuery}', ${data.limit}, ${data.skip - data.limit})"
                style="padding: 8px 16px; cursor: pointer;">
                &larr; Previous
            </button>
            
            <span>Page <b>${currentPage}</b> of <b>${totalPages}</b></span>

            <button ${!hasNext ? 'disabled' : ''} 
                onclick="loadProducts('${currentQuery}', ${data.limit}, ${data.skip + data.limit})"
                style="padding: 8px 16px; cursor: pointer;">
                Next &rarr;
            </button>
        </div>
        <div style="margin-top: 10px; color: #666; font-size: 0.9em;">
            Showing items ${data.skip + 1} - ${Math.min(data.skip + data.limit, data.total)} of ${data.total}
        </div>
    `;

    // 3. Update the DOM
    resultDiv.innerHTML = `
        <div style="font-family: sans-serif; max-width: 800px; margin: auto;">
            <h1 style="color: #333;">Product Results for "${currentQuery}"</h1>
            ${productsHtml}
            ${paginationHtml}
        </div>
    `;
}

// Initial Call to load data on page load
loadProducts(currentQuery, currentLimit, currentSkip);
