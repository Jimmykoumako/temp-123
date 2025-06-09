export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _HymnTitleAuthors: {
        Row: {
          A: number
          B: string
        }
        Insert: {
          A: number
          B: string
        }
        Update: {
          A?: number
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_HymnTitleAuthors_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Author"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_HymnTitleAuthors_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "HymnTitle"
            referencedColumns: ["number"]
          },
        ]
      }
      _HymnTitleComposers: {
        Row: {
          A: number
          B: string
        }
        Insert: {
          A: number
          B: string
        }
        Update: {
          A?: number
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_HymnTitleComposers_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Composer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_HymnTitleComposers_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "HymnTitle"
            referencedColumns: ["number"]
          },
        ]
      }
      _HymnTitleMetrics: {
        Row: {
          A: string
          B: number
        }
        Insert: {
          A: string
          B: number
        }
        Update: {
          A?: string
          B?: number
        }
        Relationships: [
          {
            foreignKeyName: "_HymnTitleMetrics_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "HymnTitle"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "_HymnTitleMetrics_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "Metric"
            referencedColumns: ["id"]
          },
        ]
      }
      _HymnTitleSources: {
        Row: {
          A: string
          B: number
        }
        Insert: {
          A: string
          B: number
        }
        Update: {
          A?: string
          B?: number
        }
        Relationships: [
          {
            foreignKeyName: "_HymnTitleSources_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "HymnTitle"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "_HymnTitleSources_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "Source"
            referencedColumns: ["id"]
          },
        ]
      }
      _HymnTitleTopics: {
        Row: {
          A: string
          B: number
        }
        Insert: {
          A: string
          B: number
        }
        Update: {
          A?: string
          B?: number
        }
        Relationships: [
          {
            foreignKeyName: "_HymnTitleTopics_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "HymnTitle"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "_HymnTitleTopics_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "Topic"
            referencedColumns: ["id"]
          },
        ]
      }
      _HymnTitleTunes: {
        Row: {
          A: string
          B: number
        }
        Insert: {
          A: string
          B: number
        }
        Update: {
          A?: string
          B?: number
        }
        Relationships: [
          {
            foreignKeyName: "_HymnTitleTunes_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "HymnTitle"
            referencedColumns: ["number"]
          },
          {
            foreignKeyName: "_HymnTitleTunes_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "Tune"
            referencedColumns: ["id"]
          },
        ]
      }
      _LikedAlbums: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_LikedAlbums_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Album"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_LikedAlbums_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      _LikedPlaylists: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_LikedPlaylists_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Playlist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_LikedPlaylists_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      _LikedTracks: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_LikedTracks_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Track"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_LikedTracks_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      _PlaylistTracks: {
        Row: {
          A: string
          B: string
        }
        Insert: {
          A: string
          B: string
        }
        Update: {
          A?: string
          B?: string
        }
        Relationships: [
          {
            foreignKeyName: "_PlaylistTracks_A_fkey"
            columns: ["A"]
            isOneToOne: false
            referencedRelation: "Playlist"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "_PlaylistTracks_B_fkey"
            columns: ["B"]
            isOneToOne: false
            referencedRelation: "Track"
            referencedColumns: ["id"]
          },
        ]
      }
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      account_deletion_requests: {
        Row: {
          email: string
          id: string
          processed_at: string | null
          processed_by: string | null
          reason: string | null
          requested_at: string
          status: string
          user_id: string
        }
        Insert: {
          email: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          requested_at?: string
          status?: string
          user_id: string
        }
        Update: {
          email?: string
          id?: string
          processed_at?: string | null
          processed_by?: string | null
          reason?: string | null
          requested_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      accounts: {
        Row: {
          access_token: string | null
          expires_at: number | null
          id: string
          id_token: string | null
          provider: string
          provider_account_id: string
          refresh_token: string | null
          scope: string | null
          session_state: string | null
          token_type: string | null
          type: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          expires_at?: number | null
          id: string
          id_token?: string | null
          provider: string
          provider_account_id: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          expires_at?: number | null
          id?: string
          id_token?: string | null
          provider?: string
          provider_account_id?: string
          refresh_token?: string | null
          scope?: string | null
          session_state?: string | null
          token_type?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ActivityLog: {
        Row: {
          actionType: Database["public"]["Enums"]["ActionType"]
          audioFileId: string | null
          audioTypeId: number | null
          bookId: number | null
          description: string | null
          hymnTitleNumber: string | null
          id: number
          timestamp: string
          userId: string | null
        }
        Insert: {
          actionType: Database["public"]["Enums"]["ActionType"]
          audioFileId?: string | null
          audioTypeId?: number | null
          bookId?: number | null
          description?: string | null
          hymnTitleNumber?: string | null
          id?: number
          timestamp?: string
          userId?: string | null
        }
        Update: {
          actionType?: Database["public"]["Enums"]["ActionType"]
          audioFileId?: string | null
          audioTypeId?: number | null
          bookId?: number | null
          description?: string | null
          hymnTitleNumber?: string | null
          id?: number
          timestamp?: string
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ActivityLog_audioFileId_fkey"
            columns: ["audioFileId"]
            isOneToOne: false
            referencedRelation: "AudioFile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ActivityLog_audioTypeId_fkey"
            columns: ["audioTypeId"]
            isOneToOne: false
            referencedRelation: "AudioType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ActivityLog_bookId_fkey"
            columns: ["bookId"]
            isOneToOne: false
            referencedRelation: "HymnBook"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ActivityLog_hymnTitleNumber_bookId_fkey"
            columns: ["hymnTitleNumber", "bookId"]
            isOneToOne: false
            referencedRelation: "HymnTitle"
            referencedColumns: ["number", "bookId"]
          },
          {
            foreignKeyName: "ActivityLog_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Album: {
        Row: {
          coverImage: string | null
          description: string | null
          genreId: number | null
          id: string
          releaseDate: string
          title: string
          userId: string
        }
        Insert: {
          coverImage?: string | null
          description?: string | null
          genreId?: number | null
          id: string
          releaseDate: string
          title: string
          userId: string
        }
        Update: {
          coverImage?: string | null
          description?: string | null
          genreId?: number | null
          id?: string
          releaseDate?: string
          title?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Album_genreId_fkey"
            columns: ["genreId"]
            isOneToOne: false
            referencedRelation: "Genre"
            referencedColumns: ["id"]
          },
        ]
      }
      ArtistProfile: {
        Row: {
          genre: string | null
          genreId: number | null
          id: number
          socialMediaLinks: Json | null
          userId: string
          website: string | null
        }
        Insert: {
          genre?: string | null
          genreId?: number | null
          id?: number
          socialMediaLinks?: Json | null
          userId: string
          website?: string | null
        }
        Update: {
          genre?: string | null
          genreId?: number | null
          id?: number
          socialMediaLinks?: Json | null
          userId?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ArtistProfile_genreId_fkey"
            columns: ["genreId"]
            isOneToOne: false
            referencedRelation: "Genre"
            referencedColumns: ["id"]
          },
        ]
      }
      AudioFile: {
        Row: {
          audioTypeId: number
          bookId: number | null
          createdAt: string
          hymnTitleNumber: string | null
          id: string
          url: string
          userId: string
        }
        Insert: {
          audioTypeId: number
          bookId?: number | null
          createdAt?: string
          hymnTitleNumber?: string | null
          id: string
          url: string
          userId: string
        }
        Update: {
          audioTypeId?: number
          bookId?: number | null
          createdAt?: string
          hymnTitleNumber?: string | null
          id?: string
          url?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "AudioFile_audioTypeId_fkey"
            columns: ["audioTypeId"]
            isOneToOne: false
            referencedRelation: "AudioType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "AudioFile_hymnTitleNumber_bookId_fkey"
            columns: ["hymnTitleNumber", "bookId"]
            isOneToOne: false
            referencedRelation: "HymnTitle"
            referencedColumns: ["number", "bookId"]
          },
          {
            foreignKeyName: "AudioFile_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      AudioType: {
        Row: {
          description: string
          id: number
          type: string
        }
        Insert: {
          description: string
          id?: number
          type: string
        }
        Update: {
          description?: string
          id?: number
          type?: string
        }
        Relationships: []
      }
      Author: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      Composer: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      Follow: {
        Row: {
          createdAt: string
          followerId: string
          followingId: string
          id: number
        }
        Insert: {
          createdAt?: string
          followerId: string
          followingId: string
          id?: number
        }
        Update: {
          createdAt?: string
          followerId?: string
          followingId?: string
          id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Follow_followerId_fkey"
            columns: ["followerId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Follow_followingId_fkey"
            columns: ["followingId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Genre: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      group_sessions: {
        Row: {
          created_at: string
          current_hymn_id: string | null
          current_verse: number | null
          description: string | null
          id: string
          is_active: boolean
          is_playing: boolean | null
          key_override: string | null
          leader_id: string
          password_hash: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          session_code: string
          tempo_override: number | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_hymn_id?: string | null
          current_verse?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_playing?: boolean | null
          key_override?: string | null
          leader_id: string
          password_hash?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          session_code: string
          tempo_override?: number | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_hymn_id?: string | null
          current_verse?: number | null
          description?: string | null
          id?: string
          is_active?: boolean
          is_playing?: boolean | null
          key_override?: string | null
          leader_id?: string
          password_hash?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          session_code?: string
          tempo_override?: number | null
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      HymnBook: {
        Row: {
          access_level: Database["public"]["Enums"]["AccessLevel"]
          added_hymns: number
          category: string | null
          created_at: string
          description: string
          id: number
          is_active: boolean
          name: string
          updated_at: string
          version: number
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["AccessLevel"]
          added_hymns?: number
          category?: string | null
          created_at?: string
          description?: string
          id?: number
          is_active?: boolean
          name: string
          updated_at?: string
          version?: number
        }
        Update: {
          access_level?: Database["public"]["Enums"]["AccessLevel"]
          added_hymns?: number
          category?: string | null
          created_at?: string
          description?: string
          id?: number
          is_active?: boolean
          name?: string
          updated_at?: string
          version?: number
        }
        Relationships: []
      }
      HymnLyric: {
        Row: {
          bookId: number
          hymnTitleNumber: string
          id: number
          lyrics: Json
          userId: string
        }
        Insert: {
          bookId?: number
          hymnTitleNumber: string
          id?: number
          lyrics: Json
          userId: string
        }
        Update: {
          bookId?: number
          hymnTitleNumber?: string
          id?: number
          lyrics?: Json
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "HymnLyric_hymnTitleNumber_bookId_fkey"
            columns: ["hymnTitleNumber", "bookId"]
            isOneToOne: false
            referencedRelation: "HymnTitle"
            referencedColumns: ["number", "bookId"]
          },
          {
            foreignKeyName: "HymnLyric_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      HymnTitle: {
        Row: {
          bookId: number
          number: string
          titles: string[] | null
        }
        Insert: {
          bookId?: number
          number: string
          titles?: string[] | null
        }
        Update: {
          bookId?: number
          number?: string
          titles?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "HymnTitle_bookId_fkey"
            columns: ["bookId"]
            isOneToOne: false
            referencedRelation: "HymnBook"
            referencedColumns: ["id"]
          },
        ]
      }
      Metric: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          createdAt: string
          id: string
          message: string
          type: Database["public"]["Enums"]["NotificationType"]
          userId: string | null
        }
        Insert: {
          createdAt?: string
          id: string
          message: string
          type: Database["public"]["Enums"]["NotificationType"]
          userId?: string | null
        }
        Update: {
          createdAt?: string
          id?: string
          message?: string
          type?: Database["public"]["Enums"]["NotificationType"]
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Playlist: {
        Row: {
          description: string | null
          id: string
          title: string
          userId: string
        }
        Insert: {
          description?: string | null
          id: string
          title: string
          userId: string
        }
        Update: {
          description?: string | null
          id?: string
          title?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Playlist_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      session_activity_logs: {
        Row: {
          action_data: Json | null
          action_type: string
          id: string
          session_id: string
          timestamp: string
          user_id: string | null
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          id?: string
          session_id: string
          timestamp?: string
          user_id?: string | null
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          id?: string
          session_id?: string
          timestamp?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_activity_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_analytics: {
        Row: {
          created_at: string
          engagement_score: number | null
          hymn_id: string
          id: string
          participant_count: number | null
          play_count: number | null
          session_id: string
          total_time_seconds: number | null
        }
        Insert: {
          created_at?: string
          engagement_score?: number | null
          hymn_id: string
          id?: string
          participant_count?: number | null
          play_count?: number | null
          session_id: string
          total_time_seconds?: number | null
        }
        Update: {
          created_at?: string
          engagement_score?: number | null
          hymn_id?: string
          id?: string
          participant_count?: number | null
          play_count?: number | null
          session_id?: string
          total_time_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "session_analytics_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          connection_status: string
          device_name: string | null
          device_type: string | null
          id: string
          is_co_leader: boolean | null
          is_following_leader: boolean | null
          joined_at: string
          last_seen: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          connection_status?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          is_co_leader?: boolean | null
          is_following_leader?: boolean | null
          joined_at?: string
          last_seen?: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          connection_status?: string
          device_name?: string | null
          device_type?: string | null
          id?: string
          is_co_leader?: boolean | null
          is_following_leader?: boolean | null
          joined_at?: string
          last_seen?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          expires: string
          id: string
          session_token: string
          user_id: string
        }
        Insert: {
          expires: string
          id: string
          session_token: string
          user_id: string
        }
        Update: {
          expires?: string
          id?: string
          session_token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Source: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      TimestampAudioFile: {
        Row: {
          audioFileUrl: string
          hymnLyricId: number
          id: number
          timestampData: Json
          userId: string
        }
        Insert: {
          audioFileUrl: string
          hymnLyricId: number
          id?: number
          timestampData: Json
          userId: string
        }
        Update: {
          audioFileUrl?: string
          hymnLyricId?: number
          id?: number
          timestampData?: Json
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "TimestampAudioFile_hymnLyricId_fkey"
            columns: ["hymnLyricId"]
            isOneToOne: false
            referencedRelation: "HymnLyric"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TimestampAudioFile_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      Topic: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      Track: {
        Row: {
          albumId: string | null
          bookId: number | null
          duration: number
          genreId: number | null
          hymnTitleNumber: string | null
          id: string
          title: string
          url: string
        }
        Insert: {
          albumId?: string | null
          bookId?: number | null
          duration: number
          genreId?: number | null
          hymnTitleNumber?: string | null
          id: string
          title: string
          url: string
        }
        Update: {
          albumId?: string | null
          bookId?: number | null
          duration?: number
          genreId?: number | null
          hymnTitleNumber?: string | null
          id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "Track_albumId_fkey"
            columns: ["albumId"]
            isOneToOne: false
            referencedRelation: "Album"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Track_genreId_fkey"
            columns: ["genreId"]
            isOneToOne: false
            referencedRelation: "Genre"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Track_hymnTitleNumber_bookId_fkey"
            columns: ["hymnTitleNumber", "bookId"]
            isOneToOne: false
            referencedRelation: "HymnTitle"
            referencedColumns: ["number", "bookId"]
          },
        ]
      }
      Tune: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          audioTypeId: number
          bookId: number
          createdAt: string
          description: string
          hymnTitle: string
          id: string
          status: Database["public"]["Enums"]["UploadStatus"]
          url: string
          userId: string
        }
        Insert: {
          audioTypeId: number
          bookId?: number
          createdAt?: string
          description: string
          hymnTitle: string
          id: string
          status?: Database["public"]["Enums"]["UploadStatus"]
          url: string
          userId: string
        }
        Update: {
          audioTypeId?: number
          bookId?: number
          createdAt?: string
          description?: string
          hymnTitle?: string
          id?: string
          status?: Database["public"]["Enums"]["UploadStatus"]
          url?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploads_audioTypeId_fkey"
            columns: ["audioTypeId"]
            isOneToOne: false
            referencedRelation: "AudioType"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "uploads_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          bio: string | null
          createdAt: string
          email: string
          email_verified: string | null
          firstName: string | null
          id: string
          image: string | null
          lastLogin: string | null
          lastName: string | null
          name: string | null
          password: string
          profilePicture: string | null
          pseudoName: string | null
          role: Database["public"]["Enums"]["UserRole"]
          status: Database["public"]["Enums"]["UserStatus"]
          updatedAt: string
        }
        Insert: {
          bio?: string | null
          createdAt?: string
          email: string
          email_verified?: string | null
          firstName?: string | null
          id: string
          image?: string | null
          lastLogin?: string | null
          lastName?: string | null
          name?: string | null
          password: string
          profilePicture?: string | null
          pseudoName?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          status?: Database["public"]["Enums"]["UserStatus"]
          updatedAt: string
        }
        Update: {
          bio?: string | null
          createdAt?: string
          email?: string
          email_verified?: string | null
          firstName?: string | null
          id?: string
          image?: string | null
          lastLogin?: string | null
          lastName?: string | null
          name?: string | null
          password?: string
          profilePicture?: string | null
          pseudoName?: string | null
          role?: Database["public"]["Enums"]["UserRole"]
          status?: Database["public"]["Enums"]["UserStatus"]
          updatedAt?: string
        }
        Relationships: []
      }
      verificationtokens: {
        Row: {
          expires: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_hymnbook_stats: {
        Args: { book_id: number }
        Returns: {
          total_hymns: number
          hymns_with_lyrics: number
          hymns_with_audio: number
          total_audio_files: number
        }[]
      }
      is_admin: {
        Args: { user_uuid?: string }
        Returns: boolean
      }
      is_uuid: {
        Args: { "": string }
        Returns: boolean
      }
    }
    Enums: {
      AccessLevel: "PRIVATE" | "PUBLIC"
      ActionType:
        | "CREATE"
        | "UPDATE"
        | "DELETE"
        | "UPLOAD"
        | "APPROVE"
        | "REJECT"
        | "SIGN_IN"
        | "SIGN_OUT"
        | "ERROR"
      NotificationType: "UPLOAD_STATUS" | "REVIEW_ALERT" | "GENERAL"
      UploadStatus:
        | "UPLOADED"
        | "PENDING_REVIEW"
        | "ERROR"
        | "APPROVED"
        | "REJECTED"
      user_role: "admin" | "user"
      UserRole:
        | "ADMIN"
        | "UPLOADER"
        | "PROOFREADER"
        | "CURATOR"
        | "REVIEWER"
        | "CONTRIBUTOR"
        | "VIEWER"
      UserStatus: "ACTIVE" | "INACTIVE" | "BANNED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      AccessLevel: ["PRIVATE", "PUBLIC"],
      ActionType: [
        "CREATE",
        "UPDATE",
        "DELETE",
        "UPLOAD",
        "APPROVE",
        "REJECT",
        "SIGN_IN",
        "SIGN_OUT",
        "ERROR",
      ],
      NotificationType: ["UPLOAD_STATUS", "REVIEW_ALERT", "GENERAL"],
      UploadStatus: [
        "UPLOADED",
        "PENDING_REVIEW",
        "ERROR",
        "APPROVED",
        "REJECTED",
      ],
      user_role: ["admin", "user"],
      UserRole: [
        "ADMIN",
        "UPLOADER",
        "PROOFREADER",
        "CURATOR",
        "REVIEWER",
        "CONTRIBUTOR",
        "VIEWER",
      ],
      UserStatus: ["ACTIVE", "INACTIVE", "BANNED"],
    },
  },
} as const
