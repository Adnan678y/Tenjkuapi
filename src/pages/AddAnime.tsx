import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Plus, X, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { animeApi } from '../lib/api';

interface AnimeForm {
  name: string;
  description: string;
  year: number;
  rating: number;
  genre: string[];
  tag: string[];
  img: string;
}

const AddAnime = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<AnimeForm>();
  const [genres, setGenres] = React.useState<string[]>([]);
  const [tags, setTags] = React.useState<string[]>([]);
  const [newGenre, setNewGenre] = React.useState('');
  const [newTag, setNewTag] = React.useState('');
  const [uploading, setUploading] = React.useState(false);

  const onSubmit = async (data: AnimeForm) => {
    try {
      const animeData = {
        ...data,
        genre: genres,
        tag: tags,
        year: parseInt(data.year.toString()),
        rating: parseFloat(data.rating.toString())
      };

      await animeApi.create(animeData);
      toast.success('Anime added successfully!');
      navigate('/list');
    } catch (error) {
      toast.error('Failed to add anime');
    }
  };

  const addGenre = () => {
    if (newGenre && !genres.includes(newGenre)) {
      setGenres([...genres, newGenre]);
      setNewGenre('');
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await animeApi.uploadImage(file);
      setValue('img', response.data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Add New Anime</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                {...register('year', { 
                  required: 'Year is required',
                  min: { value: 1900, message: 'Year must be 1900 or later' },
                  max: { value: new Date().getFullYear(), message: 'Year cannot be in the future' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <input
                type="number"
                step="0.1"
                {...register('rating', { 
                  required: 'Rating is required',
                  min: { value: 0, message: 'Rating must be between 0 and 10' },
                  max: { value: 10, message: 'Rating must be between 0 and 10' }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Genres</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="text"
                value={newGenre}
                onChange={(e) => setNewGenre(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add a genre"
              />
              <button
                type="button"
                onClick={addGenre}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                >
                  {genre}
                  <button
                    type="button"
                    onClick={() => setGenres(genres.filter(g => g !== genre))}
                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="mt-1 flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter(t => t !== tag))}
                    className="ml-1 inline-flex items-center p-0.5 rounded-full text-green-400 hover:bg-green-200 hover:text-green-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
            <div className="mt-1 flex items-center space-x-4">
              <input
                type="url"
                {...register('img', { required: 'Cover image URL is required' })}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="https://example.com/image.jpg"
              />
              <div className="relative">
                <input
                  type="file"
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  type="button"
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                    uploading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
            {errors.img && <p className="mt-1 text-sm text-red-600">{errors.img.message}</p>}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/list')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Anime
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddAnime;