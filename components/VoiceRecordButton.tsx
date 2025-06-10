import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, shadows, typography } from '../styles/commonStyles';
import { voiceService, VoiceRecordingResult } from '../services/VoiceService';
import { chatGPTService, FinanceUpdate } from '../services/ChatGPTService';
import { useFinance } from '../context/FinanceContext';

interface VoiceRecordButtonProps {
  onProcessingStart?: () => void;
  onProcessingEnd?: () => void;
  onSuccess?: (update: FinanceUpdate) => void;
  onError?: (error: string) => void;
}

export default function VoiceRecordButton({
  onProcessingStart,
  onProcessingEnd,
  onSuccess,
  onError
}: VoiceRecordButtonProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const { addVoiceIncomes, addVoiceExpenses } = useFinance();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingDuration(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRecording]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      console.log('Starting voice recording...');
      const success = await voiceService.startRecording();
      
      if (success) {
        setIsRecording(true);
        console.log('Recording started successfully');
      } else {
        Alert.alert(
          'Recording Error',
          'Could not start recording. Please check microphone permissions.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    try {
      console.log('Stopping voice recording...');
      setIsRecording(false);
      setIsProcessing(true);
      onProcessingStart?.();

      const result: VoiceRecordingResult | null = await voiceService.stopRecording();
      
      if (!result || !result.uri) {
        throw new Error('No recording data available');
      }

      console.log('Recording completed:', result);

      // Check if API key is set
      const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || 
                   process.env.REACT_APP_OPENAI_API_KEY ||
                   '';

      if (!apiKey) {
        // Simulate processing for demo purposes
        console.log('No API key found, using demo mode');
        await simulateProcessing();
        return;
      }

      chatGPTService.setApiKey(apiKey);

      // Transcribe audio
      console.log('Transcribing audio...');
      const transcription = await chatGPTService.transcribeAudio(result.uri);
      
      if (!transcription) {
        throw new Error('Failed to transcribe audio');
      }

      console.log('Transcription:', transcription);

      // Process with ChatGPT
      console.log('Processing with ChatGPT...');
      const financeUpdate = await chatGPTService.processFinanceText(transcription);
      
      if (!financeUpdate) {
        throw new Error('Failed to process finance data');
      }

      console.log('Finance update:', financeUpdate);

      // Apply updates to finance data using the new methods
      if (financeUpdate.incomes && financeUpdate.incomes.length > 0) {
        addVoiceIncomes(financeUpdate.incomes);
      }

      if (financeUpdate.expenses && financeUpdate.expenses.length > 0) {
        addVoiceExpenses(financeUpdate.expenses);
      }

      // Show success message
      const totalItems = (financeUpdate.incomes?.length || 0) + (financeUpdate.expenses?.length || 0);
      
      Alert.alert(
        'Success!',
        financeUpdate.message || `Added ${totalItems} financial item(s) from your voice input.`,
        [{ text: 'OK' }]
      );

      onSuccess?.(financeUpdate);

    } catch (error) {
      console.error('Error processing recording:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      Alert.alert(
        'Processing Error',
        `Failed to process your voice input: ${errorMessage}`,
        [{ text: 'OK' }]
      );
      
      onError?.(errorMessage);
    } finally {
      setIsProcessing(false);
      onProcessingEnd?.();
    }
  };

  const simulateProcessing = async () => {
    console.log('Simulating voice processing...');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add sample data using voice methods
    addVoiceExpenses([{
      name: 'Voice Expense (Demo)',
      amount: 50,
      type: 'monthly',
      category: 'other'
    }]);

    Alert.alert(
      'Demo Mode',
      'Added a demo expense of $50. In production, this would process your actual voice input with ChatGPT.',
      [{ text: 'OK' }]
    );
  };

  const handlePress = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const getButtonColor = () => {
    if (isProcessing) return colors.textSecondary;
    if (isRecording) return colors.danger;
    return colors.primary;
  };

  const getButtonIcon = () => {
    if (isProcessing) return 'hourglass-outline';
    if (isRecording) return 'stop';
    return 'mic';
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    if (isRecording) return `Recording ${formatDuration(recordingDuration)}`;
    return 'Voice Input';
  };

  return (
    <TouchableOpacity
      style={{
        backgroundColor: getButtonColor(),
        borderRadius: borderRadius.xl,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: spacing.md,
        ...shadows.md,
        opacity: isProcessing ? 0.7 : 1,
      }}
      onPress={handlePress}
      disabled={isProcessing}
      activeOpacity={0.8}
    >
      {isProcessing ? (
        <ActivityIndicator size="small" color="white" style={{ marginRight: spacing.sm }} />
      ) : (
        <Ionicons 
          name={getButtonIcon()} 
          size={20} 
          color="white" 
          style={{ marginRight: spacing.sm }} 
        />
      )}
      
      <Text style={{
        ...typography.bodySmall,
        color: 'white',
        fontWeight: '600',
      }}>
        {getButtonText()}
      </Text>

      {isRecording && (
        <View style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: 'white',
          marginLeft: spacing.sm,
          opacity: recordingDuration % 2 === 0 ? 1 : 0.3,
        }} />
      )}
    </TouchableOpacity>
  );
}