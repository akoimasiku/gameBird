#include "push_swap.h"

void	radix_sort(t_list **a, t_list **b, int ac)
{
	int	i;
	int	shift;
	int	temp;
	int size_a;

	shift = 0;
	index_stack(*a, ac);
	size_a = ft_lstsize(*a); // Store the initial size for the outer loop
	
	while (!is_sorted(*a))
	{
		i = 0;
		while (i < size_a) // Use the stored size
		{
			temp = (*a)->content >> shift;
			if (!(temp & 1))
				pb(a, b, 1);
			else
				ra(a, 1);
			i++;
		}
		while (*b)
			pa(a, b, 1);
		shift++;
	}
}

int	main(int ac, char **av)
{
	t_list	*a;
	t_list	*b;

	if (ac >= 2)
	{
		a = NULL;
		b = NULL;
		
		if (!stack_init(&a, ac - 1, av))
		{
			ft_lstclear(&a, free);
			return (0);
		}
		if ((ac - 1) <= 20)
			sort_small_stack(&a, &b, ac - 1);
		else
			radix_sort(&a, &b, ac - 1);
        ft_lstclear(&a, free);  // Free the memory allocated for stack a
        ft_lstclear(&b, free);  // Free the memory allocated for stack b
                                // Assuming 'content' in t_list was dynamically allocated
	}
    return 0; // Good practice to have an explicit return in main
}
