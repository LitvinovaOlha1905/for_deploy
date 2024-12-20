import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const apiUrl = process.env.REACT_APP_API_URL;

const initialState = {
	data: [],
	currentTypes: null,
	status: "",
	error: "",
};

export const fetchProductsByTypes = createAsyncThunk(
	"data/fetchProductsByTypes",
	async () => {
		try {
			const response = await fetch(`${apiUrl}/types/all-data`, {
				method: 'GET',
				redirect: 'follow',
			});

			if (!response.ok) {
				throw new Error("Failed to fetch data");
			}

			const text = await response.text();
			const json = JSON.parse(text); // Парсим текст как JSON

			// Возвращаем массив данных, если json.data - это массив
			return json.data;
		} catch (err) {
			return Promise.reject(err.message);
		}
	}
);

const dataSlice = createSlice({
	name: "data",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchProductsByTypes.pending, state => {
				state.status = "loading";
			})
			.addCase(fetchProductsByTypes.fulfilled, (state, action) => {
				state.data = action.payload; // Устанавливаем данные из ответа
				state.status = "ready";
			})
			.addCase(fetchProductsByTypes.rejected, (state, action) => {
				state.status = "error";
				state.error = action.error.message;
			});
	},
});

export default dataSlice.reducer;
