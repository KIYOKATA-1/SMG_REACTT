import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
} from "react-native";
import { useSession } from "../../../../lib/useSession";
import { StoreService } from "../../../../services/store/store.service";
import { Purchase } from "../../../../services/store/store.types";

const STATUSES: Record<number, string> = {
  0: "Необработано",
  1: "Просмотрено",
  2: "Отправлено получателю",
  3: "Получено",
  4: "Отменено",
};

// Компонент для отображения элемента списка покупок
const PurchaseItem = ({
  purchase,
  onCancel,
}: {
  purchase: Purchase;
  onCancel: (id: number) => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View style={styles.purchaseCard}>
      <View style={styles.imageContainer}>
        {!imageLoaded && (
          <ActivityIndicator
            size="large"
            color="#260094"
            style={styles.imageLoader}
          />
        )}
        <Image
          source={{
            uri:
              purchase.items[0]?.item?.file_image ||
              "https://via.placeholder.com/150",
          }}
          style={styles.purchaseImage}
          onLoad={() => setImageLoaded(true)}
        />
      </View>
      <View style={styles.purchaseInfo}>
        <Text style={styles.purchaseTitle}>
          {purchase.items[0]?.item?.name}
        </Text>
        <Text style={styles.purchaseDescription}>
          {purchase.items[0]?.item?.description || "Описание отсутствует"}
        </Text>
        <Text style={styles.purchaseStatus}>
          Статус: {STATUSES[purchase.status]}
        </Text>
        <Text style={styles.purchaseDate}>
          Дата: {new Date(purchase.created).toLocaleDateString()}
        </Text>
      </View>
      {purchase.status !== 4 && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => onCancel(purchase.id)}
        >
          <Text style={styles.cancelButtonText}>Отменить</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Основной компонент для отображения истории покупок
const PurchaseHistory = () => {
  const { getSession } = useSession();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      const session = await getSession();
      if (!session?.key) {
        Alert.alert("Ошибка", "Пользователь не авторизован.");
        return;
      }

      const data = await StoreService.getPurchaseHistory(session.key);
      setPurchases(data.results || []);
    } catch (error) {
      console.error("Ошибка загрузки истории покупок:", error);
      Alert.alert("Ошибка", "Не удалось загрузить историю покупок.");
    } finally {
      setIsLoading(false);
    }
  };

  const cancelPurchase = async (id: number) => {
    try {
      const session = await getSession();
      if (!session?.key) {
        Alert.alert("Ошибка", "Пользователь не авторизован.");
        return;
      }

      await StoreService.updatePurchaseStatus(session.key, id, 4);
      setPurchases((prev) =>
        prev.map((purchase) =>
          purchase.id === id ? { ...purchase, status: 4 } : purchase
        )
      );
      Alert.alert("Успех", "Покупка отменена.");
    } catch (error) {
      console.error("Ошибка отмены покупки:", error);
      Alert.alert("Ошибка", "Не удалось отменить покупку.");
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  if (isLoading) {
    return (
      <ActivityIndicator size="large" color="#260094" style={styles.loading} />
    );
  }

  if (purchases.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>История покупок пуста.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView>
      <FlatList
        data={purchases}
        renderItem={({ item }) => (
          <PurchaseItem purchase={item} onCancel={cancelPurchase} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default PurchaseHistory;

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  purchaseCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  imageContainer: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  imageLoader: {
    position: "absolute",
    zIndex: 1,
  },
  purchaseImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  purchaseInfo: {
    flex: 1,
  },
  purchaseTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#260094",
  },
  purchaseDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  purchaseStatus: {
    fontSize: 14,
    color: "#260094",
  },
  purchaseDate: {
    fontSize: 12,
    color: "#999",
  },
  cancelButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2277E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
  },
});
