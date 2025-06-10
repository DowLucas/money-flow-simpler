import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useFinance } from '../../context/FinanceContext';
import { commonStyles, colors, spacing, borderRadius, shadows, typography } from '../../styles/commonStyles';
import { Ionicons } from '@expo/vector-icons';
import AddExpenseModal from '../../components/AddExpenseModal';

export default function ExpensesScreen() {
  const { data, deleteExpense } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDeleteExpense = (id: string, name: string) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteExpense(id);
            console.log('Deleted expense:', id);
          }
        },
      ]
    );
  };

  const getTotalMonthlyExpenses = () => {
    return data.expenses.reduce((total, expense) => {
      let monthlyAmount = 0;
      switch (expense.type) {
        case 'monthly':
        case 'static':
          monthlyAmount = expense.amount;
          break;
        case 'yearly':
          monthlyAmount = expense.amount / 12;
          break;
      }
      return total + monthlyAmount;
    }, 0);
  };

  const getExpensesByType = () => {
    const monthly = data.expenses.filter(e => e.type === 'monthly');
    const static_expenses = data.expenses.filter(e => e.type === 'static');
    const yearly = data.expenses.filter(e => e.type === 'yearly');
    return { monthly, static: static_expenses, yearly };
  };

  const { monthly, static: staticExpenses, yearly } = getExpensesByType();

  const ExpenseCard = ({ expense }: { expense: any }) => (
    <View style={{
      backgroundColor: colors.card,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginVertical: spacing.xs,
      ...shadows.sm,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            ...typography.bodySmall,
            color: colors.text,
            fontWeight: '600',
            marginBottom: spacing.xs / 2,
          }}>
            {expense.name}
          </Text>
          <Text style={{
            ...typography.h4,
            color: colors.danger,
            fontWeight: '700',
          }}>
            {formatCurrency(expense.amount)}
            <Text style={{
              ...typography.caption,
              color: colors.textSecondary,
              fontWeight: '400',
            }}>
              /{expense.type === 'yearly' ? 'year' : 'month'}
            </Text>
          </Text>
          {expense.type === 'yearly' && (
            <Text style={{
              ...typography.caption,
              color: colors.textLight,
              marginTop: spacing.xs / 2,
            }}>
              {formatCurrency(expense.amount / 12)}/month
            </Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteExpense(expense.id, expense.name)}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: `${colors.danger}15`,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="trash-outline" size={14} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

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
        <Text style={commonStyles.headerTitle}>Expenses</Text>
      </View>

      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={{
          backgroundColor: colors.danger,
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
            Total Monthly Expenses
          </Text>
          <Text style={{
            ...typography.h2,
            color: 'white',
            fontWeight: '700',
          }}>
            {formatCurrency(getTotalMonthlyExpenses())}
          </Text>
          <Text style={{
            ...typography.caption,
            color: 'white',
            opacity: 0.8,
            marginTop: spacing.xs,
          }}>
            From {data.expenses.length} expense{data.expenses.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Add Expense Button */}
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
            Add Expense
          </Text>
        </TouchableOpacity>

        {/* Expenses List */}
        {data.expenses.length === 0 ? (
          <View style={{
            backgroundColor: colors.card,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            alignItems: 'center',
            marginVertical: spacing.lg,
            ...shadows.sm,
          }}>
            <Ionicons name="trending-down-outline" size={48} color={colors.textLight} />
            <Text style={{
              ...typography.h4,
              color: colors.text,
              marginTop: spacing.md,
              textAlign: 'center',
            }}>
              No Expenses
            </Text>
            <Text style={{
              ...typography.bodySmall,
              color: colors.textSecondary,
              textAlign: 'center',
              marginTop: spacing.sm,
            }}>
              Add your first expense to start tracking your spending
            </Text>
          </View>
        ) : (
          <>
            {monthly.length > 0 && (
              <View style={{ marginVertical: spacing.md }}>
                <Text style={{
                  ...typography.h4,
                  color: colors.text,
                  marginBottom: spacing.sm,
                }}>
                  Monthly Expenses ({monthly.length})
                </Text>
                {monthly.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </View>
            )}

            {staticExpenses.length > 0 && (
              <View style={{ marginVertical: spacing.md }}>
                <Text style={{
                  ...typography.h4,
                  color: colors.text,
                  marginBottom: spacing.sm,
                }}>
                  Static Expenses ({staticExpenses.length})
                </Text>
                {staticExpenses.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </View>
            )}

            {yearly.length > 0 && (
              <View style={{ marginVertical: spacing.md }}>
                <Text style={{
                  ...typography.h4,
                  color: colors.text,
                  marginBottom: spacing.sm,
                }}>
                  Yearly Expenses ({yearly.length})
                </Text>
                {yearly.map((expense) => (
                  <ExpenseCard key={expense.id} expense={expense} />
                ))}
              </View>
            )}
          </>
        )}

        <View style={{ height: spacing.xxl }} />
      </ScrollView>

      <AddExpenseModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </View>
  );
}