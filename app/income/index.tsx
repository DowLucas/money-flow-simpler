import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useFinance } from '../../context/FinanceContext';
import { commonStyles, colors, spacing, borderRadius, shadows, typography } from '../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import AddIncomeModal from '../../components/AddIncomeModal';

export default function IncomeScreen() {
  const { data, deleteIncome } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDeleteIncome = (id: string, name: string) => {
    Alert.alert(
      'Delete Income',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteIncome(id);
            console.log('Deleted income:', id);
          }
        },
      ]
    );
  };

  const getTotalMonthlyIncome = () => {
    return data.incomes.reduce((total, income) => {
      const monthlyAmount = income.type === 'yearly' ? income.amount / 12 : income.amount;
      return total + monthlyAmount;
    }, 0);
  };

  return (
    <View style={commonStyles.container}>
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.backgroundAlt,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: spacing.md,
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={commonStyles.headerTitle}>Income Sources</Text>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={{
          backgroundColor: colors.success,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          marginVertical: spacing.md,
          ...shadows.sm,
        }}>
          <Text style={{
            ...typography.bodySmall,
            color: 'white',
            opacity: 0.9,
            marginBottom: spacing.xs,
          }}>
            Total Monthly Income
          </Text>
          <Text style={{
            ...typography.h2,
            color: 'white',
            fontWeight: '700',
          }}>
            {formatCurrency(getTotalMonthlyIncome())}
          </Text>
          <Text style={{
            ...typography.caption,
            color: 'white',
            opacity: 0.8,
            marginTop: spacing.xs,
          }}>
            From {data.incomes.length} source{data.incomes.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Add Income Button */}
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            borderRadius: borderRadius.md,
            padding: spacing.md,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginVertical: spacing.md,
            ...shadows.sm,
          }}
          onPress={() => setShowAddModal(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="white" style={{ marginRight: spacing.xs }} />
          <Text style={{
            ...typography.bodySmall,
            color: 'white',
            fontWeight: '600',
          }}>
            Add Income Source
          </Text>
        </TouchableOpacity>

        {/* Income List */}
        {data.incomes.length === 0 ? (
          <View style={{
            backgroundColor: colors.card,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            alignItems: 'center',
            marginVertical: spacing.lg,
            ...shadows.sm,
          }}>
            <Ionicons name="trending-up-outline" size={48} color={colors.textLight} />
            <Text style={{
              ...typography.h4,
              color: colors.text,
              marginTop: spacing.md,
              textAlign: 'center',
            }}>
              No Income Sources
            </Text>
            <Text style={{
              ...typography.bodySmall,
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: spacing.sm,
            }}>
              Add your first income source to start tracking your finances
            </Text>
          </View>
        ) : (
          data.incomes.map((income) => (
            <View key={income.id} style={{
              backgroundColor: colors.card,
              borderRadius: borderRadius.lg,
              padding: spacing.lg,
              marginVertical: spacing.sm,
              ...shadows.sm,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    ...typography.h4,
                    color: colors.text,
                    marginBottom: spacing.xs,
                  }}>
                    {income.name}
                  </Text>
                  <Text style={{
                    ...typography.bodySmall,
                    color: colors.textSecondary,
                    marginBottom: spacing.sm,
                  }}>
                    {income.type.charAt(0).toUpperCase() + income.type.slice(1)} Income
                  </Text>
                  <Text style={{
                    ...typography.h3,
                    color: colors.success,
                    fontWeight: '700',
                  }}>
                    {formatCurrency(income.amount)}
                    <Text style={{
                      ...typography.bodySmall,
                      color: colors.textSecondary,
                      fontWeight: '400',
                    }}>
                      /{income.type === 'yearly' ? 'year' : 'month'}
                    </Text>
                  </Text>
                  {income.type === 'yearly' && (
                    <Text style={{
                      ...typography.caption,
                      color: colors.textLight,
                      marginTop: spacing.xs,
                    }}>
                      {formatCurrency(income.amount / 12)}/month
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteIncome(income.id, income.name)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${colors.danger}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="trash-outline" size={18} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <AddIncomeModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </View>
  );
}