import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export interface VoiceRecordingResult {
  uri: string;
  duration: number;
}

export class VoiceService {
  private recording: Audio.Recording | null = null;
  private isRecording = false;

  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      console.log('Audio permission status:', status);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting audio permissions:', error);
      return false;
    }
  }

  async startRecording(): Promise<boolean> {
    try {
      if (this.isRecording) {
        console.log('Already recording');
        return false;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Audio permission not granted');
        return false;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording...');
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      this.recording = recording;
      this.isRecording = true;
      console.log('Recording started successfully');
      return true;
    } catch (error) {
      console.error('Failed to start recording:', error);
      return false;
    }
  }

  async stopRecording(): Promise<VoiceRecordingResult | null> {
    try {
      if (!this.recording || !this.isRecording) {
        console.log('No active recording to stop');
        return null;
      }

      console.log('Stopping recording...');
      await this.recording.stopAndUnloadAsync();
      
      const uri = this.recording.getURI();
      const status = await this.recording.getStatusAsync();
      
      this.isRecording = false;
      const duration = status.isLoaded ? status.durationMillis || 0 : 0;

      console.log('Recording stopped successfully', { uri, duration });

      if (uri) {
        return {
          uri,
          duration,
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      return null;
    } finally {
      this.recording = null;
      this.isRecording = false;
    }
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }

  async cancelRecording(): Promise<void> {
    try {
      if (this.recording && this.isRecording) {
        console.log('Cancelling recording...');
        await this.recording.stopAndUnloadAsync();
      }
    } catch (error) {
      console.error('Error cancelling recording:', error);
    } finally {
      this.recording = null;
      this.isRecording = false;
    }
  }
}

export const voiceService = new VoiceService();