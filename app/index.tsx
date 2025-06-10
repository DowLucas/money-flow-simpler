import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { useFinance } from '../context/FinanceContext';
import { commonStyles, colors, spacing, borderRadius, shadows, typography } from '../styles/commonStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import VoiceRecordButton from '../components/VoiceRecordButton';

const { width } = Dimensions.get('window');

export default function Dashboard() {
  const { getMonthlyAvailable, getTotalMonthlyIncome, getTotalMonthlyExpenses, data } = useFinance();

  const monthlyAvailable = getMonthlyAvailable();
  const totalIncome = getTotalMonthlyIncome();
  const totalExpenses = getTotalMonthlyExpenses();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const QuickActionCard = ({ title, icon, onPress, color }: {
    title: string;
    icon: any;
    onPress: () => void;
    color: string;
  }) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: spacing.xs,
        ...shadows.sm,
      }}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: `${color}15`,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: spacing.sm,
        }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={{
        ...typography.bodySmall,
        color: colors.text,
        fontWeight: '600',
        textAlign: 'center',
      }}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const StatCard = ({ title, amount, subtitle, color }: {
    title: string;
    amount: number;
    subtitle?: string;
    color: string;
  }) => (
    <View style={{
      backgroundColor: colors.card,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginVertical: spacing.sm,
      ...shadows.sm,
    }}>
      <Text style={{
        ...typography.bodySmall,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
      }}>
        {title}
      </Text>
      <Text style={{
        ...typography.h2,
        color: color,
        fontWeight: '700',
      }}>
        {formatCurrency(amount)}
      </Text>
      {subtitle && (
        <Text style={{
          ...typography.caption,
          color: colors.textLight,
          marginTop: spacing.xs,
        }}>
          {subtitle}
        </Text>
      )}
    </View>
  );

  return (
    <View style={commonStyles.container}>
      <ScrollView style={commonStyles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingVertical: spacing.lg }}>
          <Text style={{
            ...typography.h1,
            color: colors.text,
            textAlign: 'center',
            marginBottom: spacing.sm,
          }}>
            Finance Dashboard
          </Text>
          <Text style={{
            ...typography.bodySmall,
            color: colors.textSecondary,
            textAlign: 'center',
          }}>
            Track your monthly spending power
          </Text>
        </View>

        {/* Voice Recording Button */}
        <VoiceRecordButton
          onProcessingStart={() => console.log('Voice processing started')}
          onProcessingEnd={() => console.log('Voice processing ended')}
          onSuccess={(update) => console.log('Voice processing success:', update)}
          onError={(error) => console.log('Voice processing error:', error)}
        />

        {/* Available Money Card */}
        <LinearGradient
          colors={monthlyAvailable >= 0 ? [colors.secondary, colors.secondaryLight] : [colors.danger, '#F87171']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            borderRadius: borderRadius.xl,
            padding: spacing.xl,
            marginVertical: spacing.lg,
            ...shadows.lg,
          }}
        >
          <Text style={{
            ...typography.bodySmall,
            color: 'white',
            opacity: 0.9,
            marginBottom: spacing.sm,
          }}>
            Available This Month
          </Text>
          <Text style={{
            ...typography.h1,
            color: 'white',
            fontWeight: '800',
            fontSize: 36,
          }}>
            {formatCurrency(monthlyAvailable)}
          </Text>
          <Text style={{
            ...typography.caption,
            color: 'white',
            opacity: 0.8,
            marginTop: spacing.sm,
          }}>
            {monthlyAvailable >= 0 ? 'You\'re on track!' : 'Review your expenses'}
          </Text>
        </LinearGradient>

        {/* Stats Cards */}
        <StatCard
          title="Monthly Income"
          amount={totalIncome}
          subtitle={`From ${data.incomes.length} source${data.incomes.length !== 1 ? 's' : ''}`}
          color={colors.success}
        />
        
        <StatCard
          title="Monthly Expenses"
          amount={totalExpenses}
          subtitle={`From ${data.expenses.length} expense${data.expenses.length !== 1 ? 's' : ''}`}
          color={colors.danger}
        />

        {/* Quick Actions */}
        <View style={{ marginVertical: spacing.lg }}>
          <Text style={{
            ...typography.h3,
            color: colors.text,
            marginBottom: spacing.md,
          }}>
            Quick Actions
          </Text>
          
          <View style={{ flexDirection: 'row', marginBottom: spacing.md }}>
            <QuickActionCard
              title="Add Income"
              icon="add-circle-outline"
              color={colors.success}
              onPress={() => router.push('/income')}
            />
            <QuickActionCard
              title="Add Expense"
              icon="remove-circle-outline"
              color={colors.danger}
              onPress={() => router.push('/expenses')}
            />
          </View>

          <View style={{ flexDirection: 'row' }}>
            <QuickActionCard
              title="View Income"
              icon="trending-up-outline"
              color={colors.primary}
              onPress={() => router.push('/income')}
            />
            <QuickActionCard
              title="View Expenses"
              icon="trending-down-outline"
              color={colors.warning}
              onPress={() => router.push('/expenses')}
            />
          </View>
        </View>

        {/* Recent Activity */}
        {(data.incomes.length > 0 || data.expenses.length > 0) && (
          <View style={{ marginVertical: spacing.lg }}>
            <Text style={{
              ...typography.h3,
              color: colors.text,
              marginBottom: spacing.md,
            }}>
              Recent Activity
            </Text>
            
            {data.incomes.slice(0, 3).map((income) => (
              <View key={income.id} style={{
                backgroundColor: colors.card,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginVertical: spacing.xs,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...shadows.sm,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: `${colors.success}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing.sm,
                  }}>
                    <Ionicons name="arrow-up" size={16} color={colors.success} />
                  </View>
                  <View>
                    <Text style={{
                      ...typography.bodySmall,
                      color: colors.text,
                      fontWeight: '600',
                    }}>
                      {income.name}
                    </Text>
                    <Text style={{
                      ...typography.caption,
                      color: colors.textSecondary,
                    }}>
                      {income.type} income
                    </Text>
                  </View>
                </View>
                <Text style={{
                  ...typography.bodySmall,
                  color: colors.success,
                  fontWeight: '600',
                }}>
                  +{formatCurrency(income.amount)}
                </Text>
              </View>
            ))}

            {data.expenses.slice(0, 3).map((expense) => (
              <View key={expense.id} style={{
                backgroundColor: colors.card,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                marginVertical: spacing.xs,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                ...shadows.sm,
              }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: `${colors.danger}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: spacing.sm,
                  }}>
                    <Ionicons name="arrow-down" size={16} color={colors.danger} />
                  </View>
                  <View>
                    <Text style={{
                      ...typography.bodySmall,
                      color: colors.text,
                      fontWeight: '600',
                    }}>
                      {expense.name}
                    </Text>
                    <Text style={{
                      ...typography.caption,
                      color: colors.textSecondary,
                    }}>
                      {expense.type} expense
                    </Text>
                  </View>
                </View>
                <Text style={{
                  ...typography.bodySmall,
                  color: colors.danger,
                  fontWeight: '600',
                }}>
                  -{formatCurrency(expense.amount)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Instructions */}
        <View style={{
          backgroundColor: colors.backgroundAlt,
          borderRadius: borderRadius.lg,
          padding: spacing.lg,
          marginVertical: spacing.lg,
        }}>
          <Text style={{
            ...typography.h4,
            color: colors.text,
            marginBottom: spacing.sm,
          }}>
            🎤 Voice Input Instructions
          </Text>
          <Text style={{
            ...typography.bodySmall,
            color: colors.textSecondary,
            lineHeight: 20,
          }}>
            Tap the Voice Input button and speak naturally about your finances. For example:
          </Text>
          <Text style={{
            ...typography.bodySmall,
            color: colors.text,
            marginTop: spacing.sm,
            fontStyle: 'italic',
          }}>
            "I spent $50 on groceries today and received my $2000 monthly salary"
          </Text>
          <Text style={{
            ...typography.caption,
            color: colors.textLight,
            marginTop: spacing.sm,
          }}>
            The app will automatically categorize and add the information to your finances.
          </Text>
        </View>

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </View>
  );
}