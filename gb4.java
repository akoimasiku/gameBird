package secondhighestarraybystream;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class SecondHighestArray {

    public static void main(String[] args) {
        List<Integer> list = Arrays.asList(45, 74, 12, 48, 96, 75, 21, 49, 96); // Added a duplicate for testing
        List<Integer> list2 = Arrays.asList(1); // Test case with one element
        List<Integer> list3 = Collections.emptyList(); // Test case with empty list


        System.out.println("Second highest of list: " + findSecondHighest(list));
        System.out.println("Second highest of list2: " + findSecondHighest(list2));
        System.out.println("Second highest of list3: " + findSecondHighest(list3));

    }

  // Method to find the second highest number
    public static Optional<Integer> findSecondHighest(List<Integer> list) {
        if (list == null || list.size() < 2) {
            return Optional.empty(); // Return empty Optional for fewer than 2 elements
        }

        // Variables to track the highest and second-highest numbers
        int highest = Integer.MIN_VALUE;
        int secondHighest = Integer.MIN_VALUE;
        boolean secondHighestFound = false;

        // Iterate through the list to find highest and second highest
        for (int num : list) {
            if (num > highest) {
                secondHighest = highest;
                highest = num;
                secondHighestFound = true;
            } else if (num > secondHighest && num < highest) {
                secondHighest = num;
                secondHighestFound = true;
            }
        }

        // Return Optional of second highest if found, otherwise empty
        return secondHighestFound ? Optional.of(secondHighest) : Optional.empty();
    }
}
