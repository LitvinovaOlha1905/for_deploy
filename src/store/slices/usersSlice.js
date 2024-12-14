import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
const apiUrl = process.env.REACT_APP_API_URL;

const initialState = {
	users: [],
	currentTypes: null,
	status: '',
	error: '',
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
	try {
		const response = await fetch(`${apiUrl}admin/allUsers?page=0&size=10`, {
			method: 'GET',
			redirect: 'follow',
		});
		if (!response.ok) {
			throw new Error('Failed to fetch users');
		}

		const json = await response.json();

		return json.users;
	} catch (err) {
		console.error('Error fetching users:', err);
		return Promise.reject(err.message);
	}
});

const usersSlice = createSlice({
	name: 'users',
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder
			.addCase(fetchUsers.pending, state => {
				state.status = 'loading';
			})
			.addCase(fetchUsers.fulfilled, (state, action) => {
				state.users = action.payload;
				state.status = 'ready';
			})
			.addCase(fetchUsers.rejected, (state, action) => {
				state.status = 'error';
				state.error = action.error.message;
			});
	},
});

export default usersSlice.reducer;
