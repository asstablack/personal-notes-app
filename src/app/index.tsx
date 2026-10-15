
import { useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { myStyles } from '@/styles/main';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotesStore } from '@/store/notesStore';

export default function HomeScreen() {
  const notes = useNotesStore((state) => state.notes);
  const addNote = useNotesStore((state) => state.addNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);

  const [search, setSearch] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hydrated, setHydrated] = useState(
    useNotesStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsubscribe =
      useNotesStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });

    if (useNotesStore.persist.hasHydrated()) {
      setHydrated(true);
    }

    return unsubscribe;
  }, []);

  const filteredNotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query)
    );
  }, [notes, search]);

  function saveNote() {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty note', 'Write something before saving.');
      return;
    }

    addNote(
      title.trim() || 'Untitled note',
      content.trim()
    );

    setTitle('');
    setContent('');
    setShowEditor(false);
  }

  function confirmDelete(id: string) {
    Alert.alert(
      'Delete note?',
      'This note will be removed from your device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteNote(id),
        },
      ]
    );
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  return (
    <SafeAreaView style={myStyles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F5FA" />

      <KeyboardAvoidingView
        style={myStyles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={myStyles.header}>
          <View>
            <Text style={myStyles.eyebrow}>YOUR PERSONAL SPACE</Text>
            <Text style={myStyles.subtitle}>
              Keep your thoughts in one place.
            </Text>
          </View>

          <View style={myStyles.logo}>
            <Text style={myStyles.logoText}>N</Text>
          </View>
        </View>

        {/* Search bar with icon */}
        <View style={myStyles.searchContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#958C9D"
          />
          <TextInput
            style={myStyles.searchInput}
            placeholder="Search your notes..."
            placeholderTextColor="#958C9D"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')} hitSlop={10}>
              <Ionicons
                name="close-circle"
                size={19}
                color="#958C9D"
              />
            </Pressable>
          )}
        </View>

        <View style={myStyles.sectionHeader}>
          <View>
            <Text style={myStyles.sectionTitle}>All Notes</Text>
            <Text style={myStyles.noteCount}>
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </Text>
          </View>

          <Pressable
            style={myStyles.addButton}
            onPress={() => setShowEditor(!showEditor)}
          >
            {showEditor ? (
              <Ionicons name="close-outline" size={19} color="#FFFFFF" />
            ) : (
              <Ionicons name="add-outline" size={21} color="#FFFFFF" />
            )}
            <Text style={myStyles.addButtonText}>
              {showEditor ? 'Cancel' : 'New note'}
            </Text>
          </Pressable>
        </View>

        {showEditor && (
          <View style={myStyles.editor}>
            <TextInput
              style={myStyles.titleInput}
              placeholder="Give your note a title"
              placeholderTextColor="#958C9D"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />

            <TextInput
              style={myStyles.contentInput}
              placeholder="What's on your mind?"
              placeholderTextColor="#958C9D"
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              maxLength={5000}
            />

            <Pressable style={myStyles.saveButton} onPress={saveNote}>
              <Ionicons
                name="checkmark-circle-outline"
                size={19}
                color="#FFFFFF"
              />
              <Text style={myStyles.saveButtonText}>Save note</Text>
            </Pressable>
          </View>
        )}

        {!hydrated ? (
          <View style={myStyles.emptyState}>
            <Text style={myStyles.emptyTitle}>Loading your notes...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={
              filteredNotes.length === 0
                ? myStyles.emptyList
                : myStyles.notesList
            }
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={myStyles.emptyState}>
                <Ionicons
                  name={search ? 'search-outline' : 'document-text-outline'}
                  size={42}
                  color="#9286E8"
                  style={myStyles.emptyIcon}
                />
                <Text style={myStyles.emptyTitle}>
                  {search ? 'No matching notes' : 'No notes yet'}
                </Text>
                <Text style={myStyles.emptySubtitle}>
                  {search
                    ? 'Try another search term.'
                    : 'Capture an idea before it slips away.'}
                </Text>
                {!search && (
                  <Pressable
                    onPress={() => setShowEditor(true)}
                    style={myStyles.emptyButton}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={19}
                      color="#FFFFFF"
                    />
                    <Text style={myStyles.emptyButtonText}>
                      Create your first note
                    </Text>
                  </Pressable>
                )}
              </View>
            }
            renderItem={({ item, index }) => (
              <Pressable
                style={[
                  myStyles.noteCard,
                  index % 3 === 1 && myStyles.noteCardLilac,
                  index % 3 === 2 && myStyles.noteCardPink,
                ]}
                onLongPress={() => confirmDelete(item.id)}
                delayLongPress={350}
              >
                <View style={myStyles.noteCardHeader}>
                  <View style={myStyles.noteIcon}>
                    <Ionicons
                      name="document-text-outline"
                      size={20}
                      color="#8275D8"
                    />
                  </View>

                  <Pressable
                    hitSlop={10}
                    onPress={() => confirmDelete(item.id)}
                    style={myStyles.deleteButton}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${item.title}`}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color="#8E83D9"
                    />
                  </Pressable>
                </View>

                <Text style={myStyles.noteTitle} numberOfLines={1}>
                  {item.title}
                </Text>

                <Text style={myStyles.noteContent} numberOfLines={3}>
                  {item.content || 'No additional text'}
                </Text>

                <View style={myStyles.cardFooter}>
                  <Text style={myStyles.noteDate}>
                    {formatDate(item.createdAt)}
                  </Text>
                  <Text style={myStyles.cardLabel}>PERSONAL</Text>
                </View>
              </Pressable>
            )}
          />
        )}

        <Text style={myStyles.footer}>
          A little space for your thoughts ♡
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
