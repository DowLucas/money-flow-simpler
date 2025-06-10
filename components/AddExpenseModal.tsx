import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useFinance } from '../context/FinanceContext';
import { commonStyles, colors, spacing, borderRadius, shadows, typography } from '../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';

interface AddExpenseModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({ visible, onClose }: AddExpenseModalProps) {
  const { addExpense } = useFinance();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'monthly' | 'static' | 'yearly'>('monthly');

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an expense name');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    addExpense({
      name: name.trim(),
      amount: numAmount,
      type,
    });

    console.log('Added expense:', { name: name.trim(), amount: numAmount, type });
    
    // Reset form
    setName('');
    setAmount('');
    setType('monthly');
    onClose();
  };

  const handleClose = () => {
    setName('');
    setAmount('');
    setType('monthly');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
      }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: borderRadius.xl,
            borderTopRightRadius: borderRadius.xl,
            paddingHorizontal: spacing.lg,
            paddingTop: spacing.lg,
            paddingBottom: Platform.OS === 'ios' ? spacing.xl : spacing.lg,
            maxHeight: '80%',
          }}
        >
          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: spacing.lg,
          }}>
            <Text style={{
              ...typography.h3,
              color: colors.text,
            }}>
              Add Expense
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: colors.backgroundAlt,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={18} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View>
            {/* Name Input */}
            <View style={{ marginBottom: spacing.md }}>
              <Text style={commonStyles.label}>Expense Name</Text>
              <TextInput
                style={commonStyles.input}
                value={name}
                onChangeText={setName}
                placeholder="e.g., Rent, Groceries, Insurance"
                placeholderTextColor={colors.textLight}
              />
            </View>

            {/* Amount Input */}
            <View style={{ marginBottom: spacing.md }}>
              <Text style={commonStyles.label}>Amount ($)</Text>
              <TextInput
                style={commonStyles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor={colors.textLight}
                keyboardType="numeric"
              />
            </View>

            {/* Type Selection */}
            <View style={{ marginBottom: spacing.xl }}>
              <Text style={commonStyles.label}>Expense Type</Text>
              <View style={{
                flexDirection: 'row',
                marginTop: spacing.sm,
              }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.xs,
                    borderRadius: borderRadius.md,
                    backgroundColor: type === 'monthly' ? colors.primary : colors.backgroundAlt,
                    marginRight: spacing.xs,
                    alignItems: 'center',
                  }}
                  onPress={() => setType('monthly')}
                >
                  <Text style={{
                    ...typography.caption,
                    color: type === 'monthly' ? 'white' : colors.text,
                    fontWeight: '600',
                  }}>
                    Monthly
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.xs,
                    borderRadius: borderRadius.md,
                    backgroundColor: type === 'static' ? colors.primary : colors.backgroundAlt,
                    marginHorizontal: spacing.xs,
                    alignItems: 'center',
                  }}
                  onPress={() => setType('static')}
                >
                  <Text style={{
                    ...typography.caption,
                    color: type === 'static' ? 'white' : colors.text,
                    fontWeight: '600',
                  }}>
                    Static
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: spacing.sm,
                    paddingHorizontal: spacing.xs,
                    borderRadius: borderRadius.md,
                    backgroundColor: type === 'yearly' ? colors.primary : colors.backgroundAlt,
                    marginLeft: spacing.xs,
                    alignItems: 'center',
                  }}
                  onPress={() => setType('yearly')}
                >
                  <Text style={{
                    ...typography.caption,
                    color: type === 'yearly' ? 'white' : colors.text,
                    fontWeight: '600',
                  }}>
                    Yearly
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={{
                ...typography.caption,
                color: colors.textSecondary,
                marginTop: spacing.xs,
                textAlign: 'center',
              }}>
                Monthly: recurring • Static: fixed monthly • Yearly: annual expenses
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={{
                backgroundColor: colors.danger,
                borderRadius: borderRadius.md,
                paddingVertical: spacing.md,
                alignItems: 'center',
                ...shadows.sm,
              }}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={{
                ...typography.bodySmall,
                color: 'white',
                fontWeight: '600',
              }}>
                Add Expense
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}