import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

// Thunks
export const fetchCrops = createAsyncThunk('crops/fetchCrops', async (_, { rejectWithValue }) => {
    try {
        const res = await api.get('/crops');
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.msg || err.message);
    }
});

export const addCrop = createAsyncThunk('crops/addCrop', async (formData, { rejectWithValue }) => {
    try {
        // Need to set content-type for FormData? Axios usually handles it automatically
        const res = await api.post('/crops', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.msg || err.message);
    }
});

export const addDisease = createAsyncThunk('crops/addDisease', async ({ cropId, diseaseData }, { rejectWithValue }) => {
    try {
        const res = await api.put(`/crops/${cropId}/disease`, diseaseData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.msg || err.message);
    }
});

export const deleteCrop = createAsyncThunk('crops/deleteCrop', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/crops/${id}`);
        return id;
    } catch (err) {
        return rejectWithValue(err.response?.data?.msg || err.message);
    }
});

export const deleteDisease = createAsyncThunk('crops/deleteDisease', async ({ cropId, diseaseId }, { rejectWithValue }) => {
    try {
        const res = await api.delete(`/crops/${cropId}/disease/${diseaseId}`);
        return res.data; // Returns updated crop
    } catch (err) {
        return rejectWithValue(err.response?.data?.msg || err.message);
    }
});

const cropSlice = createSlice({
    name: 'crops',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCrops.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchCrops.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCrops.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Crop
            .addCase(addCrop.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Add Disease
            .addCase(addDisease.fulfilled, (state, action) => {
                const index = state.items.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete Crop
            .addCase(deleteCrop.fulfilled, (state, action) => {
                state.items = state.items.filter(crop => crop._id !== action.payload);
            })
            // Delete Disease
            .addCase(deleteDisease.fulfilled, (state, action) => {
                const index = state.items.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    }
});

export default cropSlice.reducer;
